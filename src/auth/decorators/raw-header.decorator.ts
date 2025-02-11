import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const RawHeader = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const rawHeader = req.rawHeaders;

  if (!rawHeader)
    throw new InternalServerErrorException('rawHeader not found (request)');

  return rawHeader;
});
