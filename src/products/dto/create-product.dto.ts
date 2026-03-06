import { IsNumber, isNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(3)
    title: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    @MinLength(5)
    description: string;

    @IsString()
    @IsOptional()
    slug?: string;
}
