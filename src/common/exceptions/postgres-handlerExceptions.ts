import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export class PostgresHandlerExceptions {
  private logger = new Logger('handlerDBExceptions');

  handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      this.logger.error(error.detail);
      throw new BadRequestException(error.detail);
    }

    if (error.code === '23502') {
      const message = `The column (${error.column}) can't be null`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    if (error.code === '23503') {
      const message = `Violates foreign key constraint in table (${error.table})`;

      this.logger.error(message);

      throw new InternalServerErrorException(message);
    }

    this.logger.error(error.message);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
