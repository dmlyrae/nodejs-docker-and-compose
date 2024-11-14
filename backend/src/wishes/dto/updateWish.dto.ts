import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
} from 'class-validator';

export class UpdateWishDto {
  @Length(1, 250)
  name?: string;

  @IsString()
  link?: string;

  @IsUrl()
  image?: string;

  @IsNumber()
  price?: number;

  @IsString()
  @Max(1500)
  @IsOptional()
  description?: string;
}
