import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  activateProduct(id: string, user: User) {
    throw new Error('Method not implemented.');
  }

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>

  ){}


  async create(createProductDto: CreateProductDto, user: User) {

  try {

    const { images = [], ...productDetails} = createProductDto


    const product = this.productRepository.create({
      ...productDetails,
      images: images.map( image => this.productImageRepository.create({url: image})),
      user,
    });

    await this.productRepository.save( product );

    return this.findOne(product.id);

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
      product = await this.productRepository.findOne({ 
        where: {id: term },
        relations: {images: true}
      });

    }else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
      .where('UPPER(product.title) LIKE :title OR product.slug LIKE :slug', {
        title:`%${term.toUpperCase()}%`,
        slug:`%${term.toLowerCase()}%`
      })
      .leftJoinAndSelect('product.images', 'productImages')
      .leftJoinAndSelect('product.user', 'user')
      .getOne();
    }
    
      if (!product)
      throw new NotFoundException(`Product whit  ${term} not found`);

      return product;
  }

async find(user: User, PaginationDto: PaginationDto) {

  const {limit = 10, offset = 0} = PaginationDto

  const product = await this.productRepository.find({
    where: {user: {id: user.id}},
    take: limit,
    skip: offset,
    relations: {
      images: true,
    }
  })
  return product;
}


async update(id: string, updateProductDto: UpdateProductDto, user: User) {
  const { images, ...rest } = updateProductDto;

  const product = await this.productRepository.preload({
    id,
    ...rest,
  });

  if (!product) throw new NotFoundException(`Product with ${id} not found`);

  try {
    product.user = user;

    // Si vienen imágenes nuevas, elimina las anteriores y guarda las nuevas
    if (images) {
      await this.productImageRepository.delete({ product: { id } });
      product.images = images.map(
        (url) => this.productImageRepository.create({ url })
      );
    }

    await this.productRepository.save(product);
    return this.findOne(id);

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
