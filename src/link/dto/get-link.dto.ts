import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetLinkDto {
  @ApiProperty()
  @IsString()
  shortid: string;
}
