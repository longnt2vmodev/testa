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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ConfirmStudentDto } from './dto/confirm-student.dto';
import { QueryParamStudentDto } from './dto/student-params.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  version: ['1'],
  path: 'student',
})
@ApiTags('Student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  findAll(@Query() query: QueryParamStudentDto) {
    return this.studentService.findAll(query);
  }

  @Get('admin/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.studentService.findOneAdmin(+id);
  }

  @Get('company/:id')
  findOneAndAccount(@Param('id') id: string) {
    return this.studentService.findOneAndAccount(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Patch('confirm/:id')
  confirm(@Param('id') id: string, @Body() confirmDto: ConfirmStudentDto) {
    console.log('confirmDto', confirmDto);
    return this.studentService.confirm(+id, confirmDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    console.log('id', id);
    console.log('updateStudentDto', updateStudentDto);
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
