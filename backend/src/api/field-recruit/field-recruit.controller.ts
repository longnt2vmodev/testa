import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FieldRecruitService } from './field-recruit.service';
import {
  CreateFieldRecruitArrayDto,
  CreateFieldRecruitDto,
} from './dto/create-field-recruit.dto';
import { UpdateFieldRecruitDto } from './dto/update-field-recruit.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('field-recruit')
@ApiTags('Field-Recruit')
export class FieldRecruitController {
  constructor(private readonly fieldRecruitService: FieldRecruitService) {}

  @Post()
  create(@Body() createFieldRecruitDto: CreateFieldRecruitArrayDto) {
    return this.fieldRecruitService.createMany(createFieldRecruitDto);
  }

  @Get()
  findAll() {
    return this.fieldRecruitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldRecruitService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldRecruitService.remove(+id);
  }
}
