import { Module } from '@nestjs/common';
import { LinkController } from './controllers/link.controller';
import { LinkService } from './services/link.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkRepository } from './repositories/link.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LinkRepository])],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}
