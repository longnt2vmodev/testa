import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Apply, ApplyDocument } from './apply.schema';

@Injectable()
export class ApplyService {
  constructor(
    @InjectModel(Apply.name)
    private readonly applyModel: Model<ApplyDocument>,
  ) {}
  async create(apply: any) {
    const result = await this.applyModel.create(apply);
    return result;
  }

  findAll() {
    return `This action returns all apply`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apply`;
  }

  remove(id: number) {
    return `This action removes a #${id} apply`;
  }
}
