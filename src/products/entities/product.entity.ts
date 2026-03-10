import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column('text')
    title:string;

    @Column('float', {
        default: 0
    })
    price:number;
    
    @Column('text',)
        
    description: string;


    @Column('text',{
        unique: true
    })
    slug: string;

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
