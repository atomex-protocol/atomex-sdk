import type { BinanceErrorDto } from './dtos';

export const isErrorDto = (dto: unknown): dto is BinanceErrorDto => {
  const errorDto = dto as BinanceErrorDto;
  return typeof errorDto.code === 'number' && typeof errorDto.msg === 'string';
};
