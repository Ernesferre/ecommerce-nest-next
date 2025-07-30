import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
// import { UpdateSaleDto } from './dto/update-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll(@Query('saleDate') saleDate: string) {
    return this.salesService.findAll(saleDate);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.salesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.salesService.remove(+id);
  }
}
