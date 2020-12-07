import { EntityRepository, Repository } from 'typeorm';

import { LinkEntity } from '../entities/link.entity';
import { NewLinkDto } from '../dto/new-link.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { nanoid } from 'nanoid';

@EntityRepository(LinkEntity)
export class LinkRepository extends Repository<LinkEntity> {
  async ensureLink(newLinkDto: NewLinkDto): Promise<LinkEntity> {
    const { link } = newLinkDto;

    let linkObj = await this.findOne({ link });
    if (!linkObj) {
      linkObj = await this.createLink(newLinkDto);
    }

    return linkObj;
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

  async redirect(shortid: string) {
    return await this.findOne({ shortid });
  }
}
