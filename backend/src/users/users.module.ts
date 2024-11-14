import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Wish } from 'src/wishes/entity/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { HashService } from 'src/hash/hash.service';
import { Offer } from 'src/offers/entity/offer.entity';
import { WishList } from 'src/wishlists/entity/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish, Offer, WishList])],
  providers: [UsersService, WishesService, HashService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
