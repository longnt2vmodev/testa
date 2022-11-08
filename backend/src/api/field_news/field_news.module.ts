import { Module } from '@nestjs/common';
import { FieldNewsService } from './field_news.service';
import { FieldNewsController } from './field_news.controller';

@Module({
  controllers: [FieldNewsController],
  providers: [FieldNewsService]
})
export class FieldNewsModule {}
