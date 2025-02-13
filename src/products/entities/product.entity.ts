import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ProductImage } from './product-image-entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '2c289bf8-e963-4af5-b348-a65ac7f40b6b',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product Title',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example:
      'Fugiat minim culpa elit occaecat aliqua laboris aliquip aliquip qui.',
    description: 'Product description',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product SLUG - for SEO',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock or quantity',
    default: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Product sizes',
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'kid',
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  //tags
  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  //images
  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  private tempTitle: string = '';

  @BeforeInsert()
  checSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .normalize('NFD') // Normaliza caracteres especiales (ej: á -> a)
      .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (acentos)
      .toLowerCase() // Convierte todo a minúsculas
      .trim() // Elimina espacios al inicio y final
      .replaceAll(' ', '_') // Reemplaza espacios por guiones bajos
      .replaceAll("'", ''); // Elimina comillas simples
    // .replace(/[^a-z0-9]/g, ''); // Elimina todo excepto letras y números
  }

  @AfterLoad()
  checkTitlePost() {
    if (this.title) {
      this.tempTitle = this.title;
    }
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug || this.tempTitle !== '') this.slug = this.title; // cambiar el slug cuando el titulo cambia

    this.slug = this.slug
      .normalize('NFD') // Normaliza caracteres especiales (ej: á -> a)
      .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (acentos)
      .toLowerCase() // Convierte todo a minúsculas
      .trim() // Elimina espacios al inicio y final
      .replaceAll(' ', '_') // Reemplaza espacios por guiones bajos
      .replaceAll("'", ''); // Elimina comillas simples
  }
}
