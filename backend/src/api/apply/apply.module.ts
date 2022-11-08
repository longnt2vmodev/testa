import { Module } from '@nestjs/common';
import { ApplyService } from './apply.service';
import { ApplyController } from './apply.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Apply, ApplySchema } from './apply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Apply.name, schema: ApplySchema }]),
  ],
  controllers: [ApplyController],
  providers: [ApplyService],
  exports: [ApplyService],
})
export class ApplyModule {}
