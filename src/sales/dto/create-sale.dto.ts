import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class SaleContentsDto {
  @IsNotEmpty({ message: 'El ID del producto no puede estar vacío' })
  @IsInt({ message: 'Producto no válido' })
  productId!: number;

  @IsNotEmpty({ message: 'Cantidad no puede estar vacía' })
  @IsInt({ message: 'Cantidad no válida' }) // Validate quantity too
  quantity!: number;

  @IsNotEmpty({ message: 'Precio no puede estar vacío' })
  @IsNumber({}, { message: 'Precio no válido' })
  price!: number;
}

export class CreateSaleDto {
  @IsNotEmpty({ message: 'El Total no puede ir vacio' })
  @IsNumber({}, { message: 'Cantidad no válida' })
  total!: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Los Contenidos no pueden ir vacios' })
  @ValidateNested()
  @Type(() => SaleContentsDto)
  contents!: SaleContentsDto[];
}
