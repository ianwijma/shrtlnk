import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { NewLinkDto } from '../dto/new-link.dto';
import { Response, Request } from 'express';
import { resolve } from 'path';
import { RedirectDto } from '../dto/redirect.dto';
import { LinkService } from '../services/link.service';

@Controller('')
export class LinkController {
  private logger: Logger = new Logger('LinkController');

  constructor(private linkService: LinkService) {}

  @Post('new')
  async new(
    @Body(ValidationPipe)
    newLinkDto: NewLinkDto,
  ) {
    return this.linkService.ensureLink(newLinkDto);
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
    const redirectTo = await this.linkService.redirect(redirectDto);
    if (redirectTo) {
      res.redirect(redirectTo);
    } else {
      this.logger.log(`Link with shortid ${shortid} not found`);
      res.redirect('/');
    }
  }
}
