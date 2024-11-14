import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entity/offer.entity';
import { AbstractEntity } from 'src/types/abstractEntity';
import { User } from 'src/users/entity/user.entity';
import { Column, ManyToOne, OneToMany, Entity } from 'typeorm';

@Entity()
export class Wish extends AbstractEntity {
  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'float' })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({ type: 'float', default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @Column({ default: '' })
  @Length(1, 1024)
  @IsString()
  @IsOptional()
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @IsNumber()
  copied: number;
}
