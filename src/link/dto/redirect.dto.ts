import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';

export class RedirectDto {
  @ApiProperty()
  @IsString()
  shortid: string;

  request: Request;

  static createRequestDto(shortid: string, request: Request) {
    const redirectDto = new RedirectDto();
    redirectDto.shortid = shortid;
    redirectDto.request = request;
    return redirectDto;
  }
}
