import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  name: string;

  @IsString()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsString()
  @Length(1, 1500)
  @IsOptional()
  description?: string;
}
