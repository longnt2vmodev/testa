import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    description: '_id',
  })
  @IsOptional()
  _id: number;

  @ApiPropertyOptional({
    description: 'cccd',
  })
  @IsNotEmpty()
  @IsString()
  cccd: string;

  @ApiProperty({
    description: 'university',
  })
  @IsNotEmpty()
  @IsString()
  university: string;

  @ApiProperty({
    description: 'faculty',
  })
  @IsNotEmpty()
  @IsString()
  faculty: string;

  @ApiProperty({
    description: 'major',
  })
  @IsNotEmpty()
  @IsString()
  major: string;

  @ApiPropertyOptional({
    description: 'course',
  })
  @IsOptional()
  @IsString()
  course: string;

  @ApiProperty({
    description: 'gpa',
  })
  @IsNotEmpty()
  gpa: number;

  @ApiProperty({
    description: 'card_student',
  })
  @IsNotEmpty()
  @IsString()
  card_student: string;

  @ApiProperty({
    description: 'id_account',
  })
  @IsOptional()
  id_account: number;
}
