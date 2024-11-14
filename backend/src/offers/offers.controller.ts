import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/createOffer.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { ServerException } from 'src/types/serverException';
import { HttpStatusCodes } from 'src/constants/statusCodes';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOffer(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    const userId = req.user.id;
    return await this.offersService.createOffer(userId, createOfferDto);
  }

  @Get()
  async getAll() {
    return await this.offersService.getAll();
  }

  @Get(':id')
  async getOffer(@Param('id') id: string) {
    const trueId = Number(id);
    if (Number.isNaN(trueId)) {
      throw new ServerException(HttpStatusCodes.BAD_REQUEST);
    }
    return await this.offersService.findById(trueId);
  }
}
