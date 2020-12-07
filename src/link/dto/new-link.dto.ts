import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewLinkDto {
  @ApiProperty({
    default: 'https://ian.wij.ma',
  })
  @IsUrl()
  link: string;
}
