import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @Min(1)
  readonly amount: number;

  @IsBoolean()
  @IsOptional()
  readonly hidden?: boolean;

  @IsNumber()
  readonly itemId: number;
}
