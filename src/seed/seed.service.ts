import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {

  constructor(
    private readonly ProductsService: ProductsService
  ){}
 
  async runSeed() {

    await this.insertNewProducts()

    return 'SEED EXECUTED Correct'
  }

  private async insertNewProducts() {
    await this.ProductsService.deleteAllProducts();

    const usuarios = initialData.usuarios

    const insertPromises: Promise<any>[]= [];

    // 3. Por cada usuario, entras a sus productos
    usuarios.forEach( usuario => {
      usuario.productos.forEach( producto => {

        // 4. Cada producto lo empujas al array como una promesa
        insertPromises.push(
          this.ProductsService.create(producto));

      });
    });

      await Promise.all( insertPromises );
    
    
    



    return true;
  }
}
