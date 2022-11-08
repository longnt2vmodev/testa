import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDateString,
  IsEnum,
  IsPhoneNumber,
  maxLength,
} from 'class-validator';
import { maxLengthPhone } from 'src/share/common/constanst';
import { RoleEnum } from 'src/share/common/enum';

export class RegisterDto {
  @ApiProperty({
    description: 'username',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'fullname',
  })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({
    description: 'birthday',
  })
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  birthday: string;

  @ApiProperty({
    description: 'phone',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'role',
  })
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: string;
}
