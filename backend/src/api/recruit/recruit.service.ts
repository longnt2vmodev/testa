import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FieldRecruitService } from '../field-recruit/field-recruit.service';
import { ConfirmRecruitDto } from './dto/confirm-recruit.dto';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { QueryParamRecruitDto } from './dto/query-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
import { Recruit, RecruitDocument } from './recruit.schema';

@Injectable()
export class RecruitService {
  constructor(
    @InjectModel(Recruit.name)
    private readonly recruitModel: Model<RecruitDocument>,
    private readonly fieldRecruitService: FieldRecruitService,
  ) {}
  async calculateId() {
    //create id
    const count: any = await this.recruitModel.aggregate([
      {
        $group: {
          _id: null,
          max: {
            $max: '$_id',
          },
        },
      },
    ]);
    console.log(count);
    return count.length ? count[0].max + 1 : 1;
  }
  async create(createRecruitDto: CreateRecruitDto) {
    const _id = await this.calculateId();
    console.log('_id', _id);
    const result = await this.recruitModel.create({
      ...createRecruitDto,
      _id: _id,
      create_date: new Date(),
    });
    const createFieldRecruitDto = {
      id_recruit: _id,
      id_field_array: createRecruitDto.fields,
    };
    const createField = await this.fieldRecruitService.createMany(
      createFieldRecruitDto,
    );
    return result;
  }

  async findOne(id: number) {
    const data = await this.recruitModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: 'tbl_company',
          localField: 'id_company',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: '$company',
      },
      {
        $lookup: {
          from: 'tbl_account',
          localField: 'company._id',
          foreignField: '_id',
          as: 'account',
        },
      },
      {
        $unwind: '$account',
      },
      {
        $lookup: {
          from: 'tbl_field_recruit',
          localField: '_id',
          foreignField: 'id_recruit',
          as: 'field_recruit',
        },
      },
      {
        $lookup: {
          from: 'tbl_field',
          localField: 'field_recruit.id_field',
          foreignField: '_id',
          as: 'fields',
        },
      },
    ]);
    return { data: data[0] };
  }

  async update(id: number, updateRecruitDto: UpdateRecruitDto) {
    const result = await this.recruitModel.updateOne();
    // const createField = await this.fieldRecruitService.createMany(
    //   // updateRecruitDto,
    // );
    return `This action updates a #${id} recruit`;
  }

  async remove(id: number, data: number) {
    const delete_date = new Date();
    const result = await this.recruitModel.updateOne(
      { _id: id },
      { delete_date, delete_id: data },
    );
    if (result.modifiedCount) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  }

  async confirm(id: number, confirmDto: ConfirmRecruitDto) {
    const result = await this.recruitModel.updateOne(
      { _id: id },
      { ...confirmDto, confirm_date: new Date(), status: true },
    );
    if (result.modifiedCount) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  }

  async findAll(query: QueryParamRecruitDto) {
    const {
      field,
      status,
      search,
      id_company,
      experience,
      pageIndex,
      pageSize,
    } = query;
    console.log('field', field);
    console.log('status', status);
    console.log('search', search);
    console.log('pageIndex', pageIndex);
    console.log('pageSize', pageSize);
    console.log('id_company', id_company);
    console.log('experience', experience);
    const condition = {};

    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(search ? search : '');

    if (status === '1') {
      condition['status'] = true;
    }
    if (status === '0') {
      condition['status'] = false;
    }

    if (id_company) {
      condition['id_company'] = +id_company;
    }

    let isExperience = {};
    switch (experience) {
      case '0': {
        isExperience = {
          $eq: ['$experience', 0],
        };
        break;
      }
      case '1': {
        isExperience = {
          $and: [{ $gt: ['$experience', 0] }, { $lt: ['$experience', 12] }],
        };
        break;
      }
      case '2': {
        isExperience = {
          $gte: ['$experience', 12],
        };
        break;
      }
      default: {
        isExperience = true;
        break;
      }
    }

    if (pageIndex && pageSize) {
    }

    let field_condition: any = true;
    if (field && +field) {
      field_condition = { $in: [+field, '$id_fields'] };
    } else {
      if (field && field.length) {
        const field_array = field.split(',');
        const conditionOr = field_array.map((item) => {
          return { $in: [+item, '$id_fields'] };
        });
        field_condition = { $or: conditionOr };
      }
    }
    console.log('field_condition', field_condition);
    let limitSkip = [];
    if (pageIndex && pageSize) {
      limitSkip = [
        {
          $skip: (+pageIndex - 1) * +pageSize,
        },
        {
          $limit: +pageSize,
        },
      ];
    }
    const companyList = await this.recruitModel.aggregate([
      //account not delete
      {
        $lookup: {
          from: 'tbl_company',
          localField: 'id_company',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: '$company',
      },
      {
        $lookup: {
          from: 'tbl_account',
          localField: 'company._id',
          foreignField: '_id',
          as: 'account',
        },
      },
      {
        $unwind: '$account',
      },
      {
        $match: {
          'account.delete_date': null,
          delete_date: null,
          ...condition,
        },
      },
      //add field
      {
        $lookup: {
          from: 'tbl_field_recruit',
          localField: '_id',
          foreignField: 'id_recruit',
          as: 'field_recruit',
          pipeline: [
            {
              $group: {
                _id: '$id_recruit',
                id_fields: {
                  $push: '$id_field',
                },
              },
            },
          ],
        },
      },
      {
        $unwind: '$field_recruit',
      },
      {
        $addFields: {
          //search
          result: {
            $or: [
              {
                $regexMatch: {
                  input: '$level',
                  regex: searchRgx,
                  options: 'i',
                },
              },
              {
                $regexMatch: {
                  input: '$way_working',
                  regex: searchRgx,
                  options: 'i',
                },
              },
              {
                $regexMatch: {
                  input: '$title',
                  regex: searchRgx,
                  options: 'i',
                },
              },
            ],
          },
          id_fields: '$field_recruit.id_fields',
        },
      },
      {
        $addFields: {
          isfields: field_condition,
          isExperience: isExperience,
        },
      },
      {
        $match: {
          result: true,
          isfields: true,
          isExperience: true,
        },
      },
      {
        $lookup: {
          from: 'tbl_field',
          localField: 'id_fields',
          foreignField: '_id',
          as: 'fields',
        },
      },
      ...limitSkip,
    ]);
    let total = 0;
    if (companyList.length) {
      //calculate total
      const companyListTotal = await this.recruitModel.aggregate([
        //account not delete
        {
          $lookup: {
            from: 'tbl_company',
            localField: 'id_company',
            foreignField: '_id',
            as: 'company',
          },
        },
        {
          $unwind: '$company',
        },
        {
          $lookup: {
            from: 'tbl_account',
            localField: 'company._id',
            foreignField: '_id',
            as: 'account',
          },
        },
        {
          $unwind: '$account',
        },
        {
          $match: {
            'account.delete_date': null,
            delete_date: null,
            ...condition,
          },
        },
        //add field
        {
          $lookup: {
            from: 'tbl_field_recruit',
            localField: '_id',
            foreignField: 'id_recruit',
            as: 'field_recruit',
            pipeline: [
              {
                $group: {
                  _id: '$id_recruit',
                  id_fields: {
                    $push: '$id_field',
                  },
                },
              },
            ],
          },
        },
        {
          $unwind: '$field_recruit',
        },
        {
          $addFields: {
            //search
            result: {
              $or: [
                {
                  $regexMatch: {
                    input: '$level',
                    regex: searchRgx,
                    options: 'i',
                  },
                },
                {
                  $regexMatch: {
                    input: '$way_working',
                    regex: searchRgx,
                    options: 'i',
                  },
                },
                {
                  $regexMatch: {
                    input: '$title',
                    regex: searchRgx,
                    options: 'i',
                  },
                },
              ],
            },
            id_fields: '$field_recruit.id_fields',
          },
        },
        {
          $addFields: {
            isfields: field_condition,
            isExperience: isExperience,
          },
        },
        {
          $match: {
            result: true,
            isfields: true,
            isExperience: true,
          },
        },
        {
          $lookup: {
            from: 'tbl_field',
            localField: 'id_fields',
            foreignField: '_id',
            as: 'fields',
          },
        },
        {
          $count: 'total',
        },
      ]);
      total = companyListTotal[0].total;
    }
    console.log(companyList);
    return {
      data: companyList,
      pageSize: +pageIndex,
      pageIndex: +pageSize,
      total: total,
    };
  }
}
