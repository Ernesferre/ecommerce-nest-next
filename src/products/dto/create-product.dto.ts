import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'The name of the product is mandatory' })
  @IsString({ message: 'The name must be a string' })
  name!: string;
  //   image?: string;
  @IsNotEmpty({ message: 'The value of the product is mandatory' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'The price is not valid' })
  price!: number;

  @IsNotEmpty({ message: 'The quantity is mandatory' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'The quantity is not valid' })
  inventory!: number;

  @IsNotEmpty({ message: 'The category ID is mandatory' })
  @IsInt({ message: 'The category is not valid' })
  categoryId!: number;
}
