import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  //images

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
      .replaceAll("'", '') // Elimina comillas simples
      .replace(/[^a-z0-9]/g, ''); // Elimina todo excepto letras y números
  }

  //@BeforeUpdate()
}
