import { IsBoolean, IsEmail, IsString } from "class-validator";
import { Product } from "src/products/entities";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";


@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('text')
    WhattsapNumber: string;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @Column('bool', { default: true })
isActive: boolean;

    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product

    @BeforeInsert()
    checkfileBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    

}
