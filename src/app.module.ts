import { Module } from '@nestjs/common';
import { LinkModule } from './link/link.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), LinkModule],
})
export class AppModule {}
