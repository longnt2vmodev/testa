import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApplyService } from './apply.service';
import { CreateApplyDto } from './dto/create-apply.dto';

@Controller('apply')
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @Post()
  create(@Body() createApplyDto: CreateApplyDto) {
    const apply = {
      ...createApplyDto, apply_date: Date.now()
    }
    return this.applyService.create(createApplyDto);
  }

  @Get()
  findAll() {
    return this.applyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applyService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applyService.remove(+id);
  }
}
