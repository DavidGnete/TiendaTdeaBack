import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsNumberString, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class LoginUserDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;

}