import { Module } from '@nestjs/common';
import { LetterStudentService } from './letter_student.service';
import { LetterStudentController } from './letter_student.controller';

@Module({
  controllers: [LetterStudentController],
  providers: [LetterStudentService]
})
export class LetterStudentModule {}
