import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SeedService {

  constructor(
    private readonly ProductsService: ProductsService,

    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ){}
 
  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.inserrUsers();

    await this.insertNewProducts(adminUser);

    return 'SEED EXECUTED Correct';
  }
  private async deleteTables() {

    await this.ProductsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
    .delete()
    .where({})
    .execute()
  }


  private async inserrUsers() {

    const seedUsers = initialData.users;

    const users: User[] = [];

    

    seedUsers.forEach( user=> {
      users.push( this.userRepository.create(user))
    });

    const dbUsers = await this.userRepository.save(seedUsers)

    return dbUsers[0]
  }



  private async insertNewProducts(user: User) {
    await this.ProductsService.deleteAllProducts();

    const usuarios = initialData.usuarios

    const insertPromises: Promise<any>[]= [];

    usuarios.forEach( usuario => {
      usuario.productos.forEach( product => {
        insertPromises.push(
          this.ProductsService.create(product, user));

      });
    });

      await Promise.all( insertPromises );
    
    
    



    return true;
  }
}
