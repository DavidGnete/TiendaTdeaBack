import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Product {
    @ApiProperty({ 
        example: 'cb80783a-92ab-41b2-af93-1d76f855490e',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string


    @ApiProperty({ 
        example: 'Venta de Buñuelos',
        description: 'En el salin B'
    })
    @Column('text')
    title:string;


    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @Column('float', {
        default: 0
    })
    price:number;
    

    @ApiProperty({
        example: 'descripcion del producto',
        description: 'produt',
    })
    @Column('text',)
        
    description: string;


    @ApiProperty({
        example: 'product_1',
        description: 'Product del slug',
        uniqueItems: true
    })
    @Column('text',{
        unique: true
    })
    slug: string;


    @Column('text')
    WhattsapNumber: number;


    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        ProductImage => ProductImage.product,
        { cascade: true }
    )
    images?: ProductImage[];

    
    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true}
    )
        user: User

    
    @BeforeInsert()
    checkSlugInsert() {
        if ( !this.slug){
            this.slug = this.title
        }
            this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')

    }
    @BeforeUpdate()
     checkSlugUpdate() {
            this.slug = this.title
            .toLocaleLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')

    }

}
