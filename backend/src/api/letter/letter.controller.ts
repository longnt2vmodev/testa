import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LetterService } from './letter.service';
import { CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';

@Controller('letter')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post()
  create(@Body() createLetterDto: CreateLetterDto) {
    return this.letterService.create(createLetterDto);
  }

  @Get()
  findAll() {
    return this.letterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.letterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLetterDto: UpdateLetterDto) {
    return this.letterService.update(+id, updateLetterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.letterService.remove(+id);
  }
}
