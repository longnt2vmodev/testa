import { Injectable } from '@nestjs/common';
import { CreateLetterStudentDto } from './dto/create-letter_student.dto';
import { UpdateLetterStudentDto } from './dto/update-letter_student.dto';

@Injectable()
export class LetterStudentService {
  create(createLetterStudentDto: CreateLetterStudentDto) {
    return 'This action adds a new letterStudent';
  }

  findAll() {
    return `This action returns all letterStudent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} letterStudent`;
  }

  update(id: number, updateLetterStudentDto: UpdateLetterStudentDto) {
    return `This action updates a #${id} letterStudent`;
  }

  remove(id: number) {
    return `This action removes a #${id} letterStudent`;
  }
}
