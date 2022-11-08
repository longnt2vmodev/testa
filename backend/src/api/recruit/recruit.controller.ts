import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RecruitService } from './recruit.service';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { DeleteDto, UpdateRecruitDto } from './dto/update-recruit.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryParamRecruitDto } from './dto/query-recruit.dto';
import { ConfirmRecruitDto } from './dto/confirm-recruit.dto';

@Controller('recruit')
@ApiTags('Recruit')
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @Post()
  create(@Body() createRecruitDto: CreateRecruitDto) {
    console.log(createRecruitDto);
    return this.recruitService.create(createRecruitDto);
  }

  @Get()
  findAll(@Query() query: QueryParamRecruitDto) {
    return this.recruitService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recruitService.findOne(+id);
  }

  @Patch('confirm/:id')
  confirm(
    @Param('id') id: string,
    @Body() confirmRecruitDto: ConfirmRecruitDto,
  ) {
    return this.recruitService.confirm(+id, confirmRecruitDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecruitDto: UpdateRecruitDto) {
    return this.recruitService.update(+id, updateRecruitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body() data: DeleteDto) {
    return this.recruitService.remove(+id, +data.delete_id);
  }
}
