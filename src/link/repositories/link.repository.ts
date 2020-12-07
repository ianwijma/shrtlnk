import { EntityRepository, Repository } from 'typeorm';

import { LinkEntity } from '../entities/link.entity';
import { NewLinkDto } from '../dto/new-link.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { nanoid } from 'nanoid';

@EntityRepository(LinkEntity)
export class LinkRepository extends Repository<LinkEntity> {
  getOneByLink(link: string) {
    return this.findOne({ link });
  }

  getOneByShortid(shortid: string) {
    return this.findOne({ shortid });
  }

  async createLink(newLinkDto: NewLinkDto) {
    const { link } = newLinkDto;

    const linkObj = new LinkEntity();
    linkObj.link = link;
    linkObj.shortid = await nanoid();
    try {
      await linkObj.save();
    } catch (error) {
      const { code } = error;
      if (code === '23505') {
        // retry
        return await this.createLink(newLinkDto);
      } else {
        throw new InternalServerErrorException();
      }
    }

    return linkObj;
  }
}
