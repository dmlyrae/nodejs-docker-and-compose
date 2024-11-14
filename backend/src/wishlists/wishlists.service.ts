import { Injectable } from '@nestjs/common';
import { WishList } from './entity/wishlist.entity';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { HttpStatusCodes } from 'src/constants/statusCodes';
import { ServerException } from 'src/types/serverException';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishlistsRepository: Repository<WishList>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    const wishlists = await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });

    if (!wishlists) {
      throw new ServerException(HttpStatusCodes.NOT_FOUND);
    }

    return wishlists;
  }

  async removeOne(userId: number, wishListId: number) {
    const wishlist = await this.findById(wishListId);

    if (userId !== wishlist.owner.id) {
      // throw new ServerException(HttpStatusCodes.FORBIDDEN);
      throw new ServerException(HttpStatusCodes.NOT_FOUND);
    }

    return await this.wishlistsRepository.delete(wishListId);
  }

  async createWishlist(userId: number, createWishlistDto: CreateWishlistDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { itemsId, ...rest } = createWishlistDto;

      const items = await this.wishesService.getWishListByIds(itemsId);
      const owner = await this.usersService.findById(userId);

      const wishList = await this.wishlistsRepository.save({
        ...rest,
        items,
        owner,
      });
      await queryRunner.commitTransaction();
      return wishList;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });

    if (!wishlist) {
      throw new ServerException(HttpStatusCodes.NOT_FOUND);
    }

    return wishlist;
  }

  async patchWishlist(
    wishlistId: number,
    userId: number,
    updateWishDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findById(wishlistId);

    if (userId != wishlist.owner.id) {
      throw new ServerException(HttpStatusCodes.FORBIDDEN);
    }

    return await this.wishlistsRepository.update(wishlistId, updateWishDto);
  }
}
