import { IsBoolean, IsEmail, IsString } from "class-validator";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from "typeorm";


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

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @BeforeInsert()
    checkfileBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    

}
