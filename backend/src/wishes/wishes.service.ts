import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Wish } from './entity/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/createWish.dto';
import { UsersService } from 'src/users/users.service';
import { HttpStatusCodes } from 'src/constants/statusCodes';
import { ServerException } from 'src/types/serverException';
import { UpdateWishDto } from './dto/updateWish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async createWish(
    userId: number,
    createWishDto: CreateWishDto,
  ): Promise<Wish> {
    const { password, ...rest } = await this.usersService.findById(userId);
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: rest,
    });
  }

  async patchWish(
    wishId: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (!wish) {
      throw new ServerException(HttpStatusCodes.NOT_FOUND);
    }

    if (userId != wish.owner.id) {
      throw new ServerException(HttpStatusCodes.FORBIDDEN);
    }

    if (wish.raised && updateWishDto.price > 0) {
      throw new ServerException(HttpStatusCodes.CONFLICT);
    }

    return await this.wishesRepository.update(wishId, updateWishDto);
  }

  async getWishById(userId: number, wishId: number) {
    const wish = await this.getById(wishId);

    if (userId != wish.owner.id) {
      wish.offers = (wish.offers ?? []).filter((offer) => !offer.hidden);
      return wish;
    }

    return wish;
  }

  async getById(wishId: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['offers', 'owner'],
    });

    if (!wish) {
      throw new ServerException(HttpStatusCodes.NOT_FOUND);
    }

    return wish;
  }

  async findLastWishes() {
    const wishes = await this.wishesRepository.find({
      relations: ['owner'],
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    if (!wishes) {
      throw new ServerException(HttpStatusCodes.NOT_FOUND);
    }

    return wishes;
  }

  async findTopWishes() {
    const wishes = await this.wishesRepository.find({
      relations: ['owner'],
      order: {
        copied: 'DESC',
      },
      take: 20,
    });

    if (!wishes) {
      throw new ServerException(HttpStatusCodes.NOT_FOUND);
    }

    return wishes;
  }

  async copyWish(userId: number, wishId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const targetWish = await this.wishesRepository.findOne({
        where: { id: wishId },
        relations: ['owner'],
      });

      if (!targetWish) {
        throw new ServerException(HttpStatusCodes.NOT_FOUND);
      }

      const { id, createdAt, updatedAt, owner, ...wishBody } = targetWish;

      if (userId == owner.id) {
        throw new ServerException(HttpStatusCodes.FORBIDDEN);
      }

      const clonedWish = await this.createWish(userId, wishBody);

      await this.wishesRepository.update(wishId, {
        copied: clonedWish.copied + 1,
      });

      await queryRunner.commitTransaction();
      return clonedWish;
    } catch {
      await queryRunner.rollbackTransaction();
    }

    await queryRunner.release();
  }

  async getWishListByIds(ids: number[]): Promise<Wish[]> {
    const wishes = await this.wishesRepository
      .createQueryBuilder('item')
      .where('item.id IN (:...ids)', { ids })
      .getMany();

    if (!wishes) {
      throw new ServerException(HttpStatusCodes.NOT_FOUND);
    }
    return wishes;
  }

  async update(userId: number, wishId: number, updateData: any) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (updateData.hasOwnProperty('price') && wish.raised > 0) {
      throw new ServerException(HttpStatusCodes.NOT_FOUND);
    }

    if (userId !== wish.owner.id) {
      throw new ServerException(HttpStatusCodes.BAD_REQUEST);
    }

    const updatedWish = await this.wishesRepository.update(wishId, updateData);

    if (updatedWish.affected === 0) {
      throw new ServerException(HttpStatusCodes.BAD_REQUEST);
    }
  }

  async updateRaised(id: number, updateData: any) {
    const wish = await this.wishesRepository.update(id, updateData);

    if (wish.affected === 0) {
      throw new ServerException(HttpStatusCodes.FORBIDDEN);
    }
  }

  async removeOne(wishId: number, userId: number): Promise<void> {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (userId !== wish.owner.id) {
      throw new ServerException(HttpStatusCodes.FORBIDDEN);
    }

    await this.wishesRepository.delete(wishId);
  }
}
