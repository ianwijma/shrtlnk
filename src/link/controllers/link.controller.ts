import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { NewLinkDto } from '../dto/new-link.dto';
import { LinkRepository } from '../repositories/link.repository';
import { Response } from 'express';
import { resolve } from 'path';

@Controller('')
export class LinkController {
  constructor(private linkRepository: LinkRepository) {}

  @Post('new')
  async new(
    @Body(ValidationPipe)
    newLinkDto: NewLinkDto,
  ) {
    return this.linkRepository.ensureLink(newLinkDto);
  }

  @Get('/')
  home(
    @Res()
    res: Response,
  ) {
    res.sendFile('index.html', {
      root: resolve(__dirname, '..', '..', '..', 'public'),
    });
  }

  @Get('/:shortid')
  async redirect(
    @Param('shortid')
    shortid: string,
    @Res()
    res: Response,
  ) {
    const link = await this.linkRepository.redirect(shortid);
    if (link) {
      res.redirect(link.link);
    } else {
      res.redirect('/');
    }
  }
}
