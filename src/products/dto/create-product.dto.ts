import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, isNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: 'Product Titlte(unique)'
    })
    @IsString()
    @MinLength(3)
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty()
    @IsString()
    @MinLength(5)
    description: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsString({ each: true} )
    @IsArray()
    @IsOptional()
    images?: string[];
}
