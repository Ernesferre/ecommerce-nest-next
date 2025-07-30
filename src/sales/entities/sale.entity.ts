import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal')
  total!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  saleDate!: Date;

  @OneToMany(() => SaleContents, (sale) => sale.sale)
  contents?: SaleContents[];
}

@Entity()
export class SaleContents {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal' })
  price!: number;

  @ManyToOne(() => Product, (product) => product.id, { eager: true, cascade: true })
  product!: Product;

  @ManyToOne(() => Sale, (sale) => sale.contents, { cascade: true })
  sale!: Sale;
}

// {
//     "id": 1,
//     "total": 100.00,
//     "saleDate": "2023-10-01T12:00:00.000Z",
//     "contents": [

//     ]

// }

// {
//   id,
//   price,
//   quantity:
//   product:
//   sale: {

//   }
// }
