import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsNumberString, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CretaUserDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    fullName: string;

    @ApiProperty()
    @MinLength(10)
    @MaxLength(10)
    @IsNumberString()
    WhattsapNumber: string;

}