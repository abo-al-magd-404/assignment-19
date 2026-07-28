import { ProductService } from './product.service';
import { Controller, Get } from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  list() {
    const data = this.productService.list();
    return { message: 'Done', data };
  }
}
