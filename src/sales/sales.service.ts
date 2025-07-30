import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale, SaleContents } from './entities/sale.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(SaleContents)
    private readonly saleContentsRepository: Repository<SaleContents>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    await this.productRepository.manager.transaction(async (transactionEntityManager) => {
      const sale = new Sale();
      const total = createSaleDto.contents.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      sale.total = total;

      for (const contents of createSaleDto.contents) {
        const product = await transactionEntityManager.findOneBy(Product, {
          id: contents.productId,
        });

        const errors: string[] = [];

        if (!product) {
          errors.push(`Product with id ${contents.productId} not found`);
          throw new BadRequestException(errors);
        }
        if (contents.quantity > product.inventory) {
          errors.push(`Insufficient inventory for product ${product.name}`);
          throw new BadRequestException(errors);
        }
        product.inventory -= contents.quantity;

        // Create transactionContents instance
        const saleContents = new SaleContents();
        saleContents.price = contents.price;
        saleContents.product = product;
        saleContents.quantity = contents.quantity;
        saleContents.sale = sale;
        await transactionEntityManager.save(sale);
        await transactionEntityManager.save(saleContents);
      }
    });

    return 'Sale created successfully';
  }

  findAll(saleDate?: string) {
    const options: FindManyOptions<Sale> = {
      relations: {
        contents: true,
      },
    };

    if (saleDate) {
      const date = parseISO(saleDate);
      if (!isValid(date)) {
        throw new BadRequestException('Invalid sale date format');
      }
      const start = startOfDay(date);
      const end = endOfDay(date);

      options.where = {
        saleDate: Between(start, end),
      };
    }

    return this.saleRepository.find(options);
  }

  async findOne(id: number) {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: {
        contents: true,
      },
    });
    if (!sale) {
      throw new BadRequestException(`Sale with id ${id} not found`);
    }
    return sale;
  }

  async remove(id: number) {
    const sale = await this.findOne(id);

    if (!sale) {
      throw new BadRequestException(`Sale with id ${id} not found`);
    }

    for (const contents of sale.contents!) {
      const product = await this.productRepository.findOneBy({ id: contents.product.id });
      product!.inventory += contents.quantity;
      await this.productRepository.save(product!);
      const saleContents = await this.saleContentsRepository.findOneBy({ id: contents.id });
      if (saleContents) {
        await this.saleContentsRepository.remove(saleContents);
      }
    }
    await this.saleRepository.remove(sale);
    return { message: `Sale with id ${id} deleted successfully` };
  }
}
