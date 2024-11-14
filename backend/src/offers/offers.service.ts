import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Offer } from './entity/offer.entity';
import { CreateOfferDto } from './dto/createOffer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { HttpStatusCodes } from 'src/constants/statusCodes';
import { ServerException } from 'src/types/serverException';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async getAll() {
    return await this.offersRepository.find({
      relations: { user: true, item: true },
    });
  }

  async findById(id: number) {
    return await this.offersRepository.find({
      where: { id },
      relations: {
        item: true,
        user: true,
      },
    });
  }

  async createOffer(userId: number, createOfferDto: CreateOfferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wish = await this.wishesService.getById(createOfferDto.itemId);

      if (userId == wish.owner.id) {
        throw new ServerException(HttpStatusCodes.FORBIDDEN);
      }

      const user = await this.usersService.findById(wish.owner.id);
      const raisedSum = Number(wish.raised + createOfferDto.amount);

      if (raisedSum > wish.price) {
        throw new ServerException(HttpStatusCodes.FORBIDDEN);
      }

      await this.wishesService.updateRaised(createOfferDto.itemId, {
        raised: raisedSum,
      });

      const offer = await this.offersRepository.save({
        ...createOfferDto,
        wish,
        user,
      });

      await queryRunner.commitTransaction();
      delete wish.owner.password;
      delete user.password;
      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    }

    await queryRunner.release();
  }
}
