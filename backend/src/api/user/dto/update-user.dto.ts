import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'username',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  username?: string;

  @ApiPropertyOptional({
    description: 'email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'fullname',
  })
  @IsOptional()
  @IsString()
  fullname?: string;

  @ApiPropertyOptional({
    description: 'birthday',
  })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiPropertyOptional({
    description: 'phone',
  })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'socket_id',
  })
  @IsOptional()
  socket_id?: string;
}

export class ChangeUserPasswordDto {
  @ApiProperty({
    description: 'id',
    example: 12,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'old password',
    example: '123456abc',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'new password',
    example: '123456abc',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({
    description: 'confirm password',
    example: '123456abc',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  confirmPassword: string;
}

export class UpdateInforUser {
  @ApiPropertyOptional({
    description: 'first_name',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  first_name: string;

  @ApiPropertyOptional({
    description: 'last_name',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  last_name: string;

  @ApiPropertyOptional({
    description: 'phone',
  })
  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @ApiPropertyOptional({
    description: 'start_date',
  })
  @IsOptional()
  @IsDateString()
  start_date: string;

  @ApiPropertyOptional({
    description: 'gender',
  })
  @IsOptional()
  gender: number;

  @ApiPropertyOptional({
    description: 'birthday',
  })
  @IsOptional()
  @IsDateString()
  birthday: string;
}

export class FileUploadDto extends UpdateInforUser {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image: any;
}
