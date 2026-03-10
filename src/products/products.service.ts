import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { title } from 'process';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>

  ){}


  async create(createProductDto: CreateProductDto) {

  try {

    const { images = [], ...productDetails} = createProductDto


    const product = this.productRepository.create({
      ...productDetails,
      images: images.map( image => this.productImageRepository.create({url: image}))
    });

    await this.productRepository.save( product );

    return { ...product, images: images};

  }catch (error){
    this.handleDBExceptions(error);
  }

  }
  

  async findAll( PaginationDto: PaginationDto) {

    const {limit = 10, offset = 0} = PaginationDto

    return  await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }

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
      ...updateProductDto,
      images: []
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

    await this.productRepository.remove( product 
      
    )
  }



  private handleDBExceptions( error: any ) {

    if ( error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('unexpect error, check server logs')
  }

  async deleteAllProducts() {
    const query = this.productImageRepository.createQueryBuilder('product');
    const product = this.productRepository.createQueryBuilder('product')


    try {
      await query
      .delete()
      .where({})
      .execute();

      return await product
      .delete()
      .where({})
      .execute();
      
    } catch (error) {
      this.handleDBExceptions(error)
      
    }

  }


}
