import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { title } from 'process';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>

  ){}


  async create(createProductDto: CreateProductDto) {

  try {
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save( product );

    return product;

  }catch (error){
    this.handleDBExceptions(error);
  }

  }
  

  async findAll( PaginationDto: PaginationDto) {

    const {limit = 10, offset = 0} = PaginationDto

    return  await this.productRepository.find({
      take: limit,
      skip: offset,

    })
  }


async findOne(term: string) {

    let product: Product | null;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term });

    }else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
      .where('UPPER(title) LIKE :title or slug LIKE :slug', {
        title:`%${term.toUpperCase()}%`,
        slug:`%${term.toLowerCase()}%`
      }).getOne();
    }
    
      if (!product)
      throw new NotFoundException(`Product whit  ${term} not found`);

      return product;
  }


 async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!product) throw new NotFoundException(`Product whit ${id} not found`);

    try {
      this.productRepository.save ( product);
      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
      
    }

  }



  async remove(id: string) {

    const product = await this.findOne(id)
    if (!product)
      throw new NotFoundException(`Id ${id} not found`)

    await this.productRepository.remove(product)
  }



  private handleDBExceptions( error: any ) {

    if ( error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('unexpect error, check server logs')
  }


}
