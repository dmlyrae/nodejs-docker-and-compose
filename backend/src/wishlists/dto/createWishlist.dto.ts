import { IsArray, IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(2, 30)
  name: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
