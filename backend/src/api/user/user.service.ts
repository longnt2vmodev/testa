import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';

import { ChangeUserPasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import { RegisterDto } from '../auth/dto/register.dto';
import { SALT_ROUNDS } from 'src/configs/constant.config';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async create(createUserDto: RegisterDto): Promise<any> {
    console.log(createUserDto);
    //create id
    const count: any = await this.userModel.aggregate([
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
    const id = count.length ? count[0].max + 1 : 1;
    const userDocument: any = {
      ...createUserDto,
      birthday: new Date(createUserDto.birthday),
      _id: id,
    };
    //check unique
    const existUser = await this.userModel.aggregate([
      {
        $match: {
          $or: [
            { email: createUserDto.email },
            { username: createUserDto.username },
          ],
        },
      },
    ]);
    if (existUser.length) {
      throw new BadRequestException('Account exist');
    }
    userDocument.password = bcrypt.hashSync(userDocument.password, SALT_ROUNDS);
    const user = await this.userModel.create(userDocument);
    return user;
  }

  async findAll(query) {
    const { pageIndex = 1, pageSize = 5, status, search } = query;
    console.log(status, search);
    const condition = {
      delete_date: null,
    };
    if (search) {
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(search);
      condition['$or'] = [
        { fullname: { $regex: searchRgx, $options: 'i' } },
        { email: { $regex: searchRgx, $options: 'i' } },
        { username: { $regex: searchRgx, $options: 'i' } },
      ];
    }
    if (status) {
      condition['status'] = status === '0' ? false : true;
    }

    const total = await this.userModel.find(condition).count();
    const accountList = await this.userModel
      .find(condition)
      .limit(+pageSize)
      .skip((+pageIndex - 1) * +pageSize);
    return {
      data: accountList,
      pageIndex: +pageIndex,
      pageSize: +pageSize,
      totalPage: Math.ceil(total / +pageSize),
    };
  }

  async findOneByCondition(condition: any) {
    const user = await this.userModel.find(condition).exec();
    return user[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel.updateOne(
      { _id: id },
      updateUserDto,
    );
    return updateUser;
  }

  async changePassword(changeUserPasswordDto: ChangeUserPasswordDto) {
    console.log(1);
    const id = changeUserPasswordDto.id;
    if (
      changeUserPasswordDto.newPassword !==
      changeUserPasswordDto.confirmPassword
    ) {
      throw new BadRequestException('');
    }
    const existed = await this.findOneByCondition({
      _id: id,
    });
    if (!existed) {
      throw new NotFoundException('Không tồn tại!');
    }
    const match = await bcrypt.compare(
      changeUserPasswordDto.oldPassword,
      existed.password,
    );
    if (!match) {
      throw new BadRequestException('Sai mật khẩu cũ');
    }
    const newPasswordHash = await bcrypt.hash(
      changeUserPasswordDto.newPassword,
      SALT_ROUNDS,
    );
    const result = await this.userModel.updateOne(
      { _id: id },
      { password: newPasswordHash },
    );
    if (result.modifiedCount) {
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  }

  async confirmUser(id: number) {
    const confirm_date = new Date();
    const result = await this.userModel.updateOne(
      { _id: id },
      { confirm_date },
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

  async remove(id: number) {
    const delete_date = new Date();
    const result = await this.userModel.updateOne({ _id: id }, { delete_date });
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
}
