import { Injectable } from '@nestjs/common';
import { CreateFieldNewDto } from './dto/create-field_new.dto';
import { UpdateFieldNewDto } from './dto/update-field_new.dto';

@Injectable()
export class FieldNewsService {
  create(createFieldNewDto: CreateFieldNewDto) {
    return 'This action adds a new fieldNew';
  }

  findAll() {
    return `This action returns all fieldNews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fieldNew`;
  }

  update(id: number, updateFieldNewDto: UpdateFieldNewDto) {
    return `This action updates a #${id} fieldNew`;
  }

  remove(id: number) {
    return `This action removes a #${id} fieldNew`;
  }
}
