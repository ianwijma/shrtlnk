import { EntityRepository, Repository } from 'typeorm';

import { LinkEntity } from '../entities/link.entity';
import { NewLinkDto } from '../dto/new-link.dto';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { nanoid } from 'nanoid';

@EntityRepository(LinkEntity)
export class LinkRepository extends Repository<LinkEntity> {
  private logger: Logger = new Logger('LinkRepository');

  getOneByLink(link: string) {
    return this.findOne({ link });
  }

  getOneByShortid(shortid: string) {
    return this.findOne({ shortid });
  }

  async createLink(newLinkDto: NewLinkDto, retry = 0, shortidSize = 5) {
    const { link } = newLinkDto;

    if (retry >= 5) {
      this.logger.log(
        `Tried to create a line for 5 times, enlarging the shortid size to ${shortidSize}`,
      );
      shortidSize++;
    }

    const linkObj = new LinkEntity();
    linkObj.link = link;
    linkObj.shortid = await nanoid(8);
    try {
      await linkObj.save();
    } catch (error) {
      const { code } = error;
      if (code === '23505') {
        // retry
        this.logger.log(`Link with shortid ${linkObj.shortid} already exists`);
        return await this.createLink(newLinkDto, ++retry, shortidSize);
      } else {
        throw new InternalServerErrorException();
      }
    }

    return linkObj;
  }
}
