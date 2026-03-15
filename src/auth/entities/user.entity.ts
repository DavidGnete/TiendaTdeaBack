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

// ------------------------------ Email verification and account activation
  /*   @Column('bool', {
        default: false
    })
    isActive: boolean;


    @Column('text', { nullable: true, select: false })
  emailVerificationToken: string | null; */

// ------------------------------

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

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
