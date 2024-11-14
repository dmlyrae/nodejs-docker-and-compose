import { IsBoolean, IsNumber } from 'class-validator';
import { Column, ManyToOne, Entity } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { Wish } from 'src/wishes/entity/wish.entity';
import { AbstractEntity } from 'src/types/abstractEntity';

@Entity()
export class Offer extends AbstractEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  amount: number;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
