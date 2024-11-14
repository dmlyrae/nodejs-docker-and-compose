import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WishList } from '../wishlists/entity/wishlist.entity';
import { Offer } from '../offers/entity/offer.entity';
import { Wish } from '../wishes/entity/wish.entity';
import { User } from '../users/entity/user.entity';

export const createDbConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  console.log(
    'configService',
    configService.get('DB_USER'),
    configService.get('PASS'),
  );
  return {
    type: 'postgres',
    port: configService.get('PORT'),
    host: configService.get('HOST'),
    username: configService.get('DB_USER'),
    password: configService.get('PASS'),
    database: configService.get('DB'),
    entities: [Offer, User, Wish, WishList],
    synchronize: configService.get('SYNCHRONIZE'),
  };
};
