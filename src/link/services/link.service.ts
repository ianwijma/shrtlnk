import { Injectable } from '@nestjs/common';
import { NewLinkDto } from '../dto/new-link.dto';
import { LinkEntity } from '../entities/link.entity';
import { LinkRepository } from '../repositories/link.repository';
import { RedirectDto } from '../dto/redirect.dto';

@Injectable()
export class LinkService {
  constructor(private linkRepository: LinkRepository) {}

  async ensureLink(newLinkDto: NewLinkDto): Promise<LinkEntity> {
    const { link } = newLinkDto;
    let linkObj = await this.linkRepository.getOneByLink(link);
    if (!linkObj) {
      linkObj = await this.linkRepository.createLink(newLinkDto);
    }
    return linkObj;
  }

  async redirect(redirectDto: RedirectDto): Promise<string> {
    const { shortid } = redirectDto;
    const linkObj = await this.linkRepository.getOneByShortid(shortid);
    if (linkObj) {
      return linkObj.link;
    }
  }
}
