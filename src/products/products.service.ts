import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto; //restOperator
      const product = this.productRepository.create({
        ...productDetails, //spreadOperator
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      // return product;
      return { ...product, images }; // retornar el producto con la estructura de imagenes recibidas (un array de strings y no un array de objetos)
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    // retornar products para recibir estructura de images como una array de objeto
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      //TODO: relaciones
      relations: {
        images: true,
      },
    });
    //acá aplanamos images para que reorna un array de strings
    return products.map((product) => ({
      ...product,
      images: product.images?.map((image) => image.url),
    }));
  }

  async findOne(term: string): Promise<Product> {
    let product: Product | null;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLocaleLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }
    if (!product)
      throw new NotFoundException(`Product with id: ${term} not found`);
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...productDetails } = await this.findOne(term);
    return {
      ...productDetails,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: [],
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);
    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    // const product = await this.findOne(id); // Doble Consulta
    // await this.productRepository.remove(product); // Doble Consulta

    const { affected } = await this.productRepository.delete(id);

    if (affected === 0) {
      throw new NotFoundException('Product not found for id: ' + id);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
