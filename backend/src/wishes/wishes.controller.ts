import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { Wish } from './entity/wish.entity';
import { CreateWishDto } from './dto/createWish.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { WishOwnerInterceptor } from 'src/interceptors/wish-owner.interceptor';
import { UpdateWishDto } from './dto/updateWish.dto';
import { ServerException } from 'src/types/serverException';
import { HttpStatusCodes } from 'src/constants/statusCodes';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.findTopWishes();
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.findLastWishes();
  }

  @UseInterceptors(WishOwnerInterceptor)
  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishById(@Req() req, @Param('id') id: number): Promise<Wish> {
    const userId = Number(req.user.id);
    const wishId = Number(id);
    if (Number.isNaN(wishId)) {
      throw new ServerException(HttpStatusCodes.BAD_REQUEST);
    }
    return await this.wishesService.getWishById(userId, wishId);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createWish(
    @Req() { user: { id } },
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    console.log(id);
    return await this.wishesService.createWish(id, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async patchWish(
    @Param('id') id: number,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const userId = Number(req.user.id);
    const wishId = Number(id);

    if (Number.isNaN(wishId)) {
      throw new ServerException(HttpStatusCodes.BAD_REQUEST);
    }

    return await this.wishesService.patchWish(wishId, userId, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() { user: { id } }, @Param(':id') wishId: number) {
    return await this.wishesService.copyWish(id, wishId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWish(@Param('id') wishId: number, @Req() { user: { id } }) {
    return this.wishesService.removeOne(wishId, id);
  }
}
