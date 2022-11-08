import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FieldNewsService } from './field_news.service';
import { CreateFieldNewDto } from './dto/create-field_new.dto';
import { UpdateFieldNewDto } from './dto/update-field_new.dto';

@Controller('field-news')
export class FieldNewsController {
  constructor(private readonly fieldNewsService: FieldNewsService) {}

  @Post()
  create(@Body() createFieldNewDto: CreateFieldNewDto) {
    return this.fieldNewsService.create(createFieldNewDto);
  }

  @Get()
  findAll() {
    return this.fieldNewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldNewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFieldNewDto: UpdateFieldNewDto) {
    return this.fieldNewsService.update(+id, updateFieldNewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldNewsService.remove(+id);
  }
}
