import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from './entity/wishlist.entity';
import { Wish } from 'src/wishes/entity/wish.entity';
import { User } from 'src/users/entity/user.entity';
import { UsersModule } from 'src/users/users.module';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WishList, Wish, User]),
    UsersModule,
    WishesModule,
  ],
  providers: [WishlistsService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
