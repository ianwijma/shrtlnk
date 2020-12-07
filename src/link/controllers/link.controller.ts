import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { NewLinkDto } from '../dto/new-link.dto';
import { LinkRepository } from '../repositories/link.repository';
import { Response, Request } from 'express';
import { resolve } from 'path';
import { RedirectDto } from '../dto/redirect.dto';

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
    @Req()
    req: Request,
  ) {
    const redirectDto = RedirectDto.createRequestDto(shortid, req);
    const link = await this.linkRepository.redirect(redirectDto);
    if (link) {
      res.redirect(link.link);
    } else {
      res.redirect('/');
    }
  }
}
