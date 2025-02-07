import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image-entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  //tags

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  //images
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
  })
  images?: ProductImage[];

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
