import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
  UseGuards,
  UseInterceptors,
  Delete,
  Patch,
} from '@nestjs/common';
import { WishList } from './entity/wishlist.entity';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { WishOwnerInterceptor } from 'src/interceptors/wish-owner.interceptor';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';
import { ServerException } from 'src/types/serverException';
import { HttpStatusCodes } from 'src/constants/statusCodes';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseInterceptors(WishOwnerInterceptor)
  @Get()
  async getAll(): Promise<WishList[]> {
    return await this.wishlistsService.findAll();
  }

  @Post()
  async create(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<WishList> {
    const id = req.user.id;
    return await this.wishlistsService.createWishlist(id, createWishlistDto);
  }

  @UseInterceptors(WishOwnerInterceptor)
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<WishList> {
    const wishlistId = Number(id);

    if (Number.isNaN(wishlistId)) {
      throw new ServerException(HttpStatusCodes.BAD_REQUEST);
    }

    return this.wishlistsService.findById(wishlistId);
  }

  @Delete(':id')
  async deleteWishlist(@Req() req, @Param('id') wishlistId: number) {
    const id = req.user.id;
    return await this.wishlistsService.removeOne(wishlistId, id);
  }

  @Patch(':id')
  async patchWishlist(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const userId = Number(req.user.id);
    const wishlistId = Number(id);

    if (Number.isNaN(wishlistId)) {
      throw new ServerException(HttpStatusCodes.BAD_REQUEST);
    }

    return await this.wishlistsService.patchWishlist(
      wishlistId,
      userId,
      updateWishlistDto,
    );
  }
}
