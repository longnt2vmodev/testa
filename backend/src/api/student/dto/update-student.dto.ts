import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStudentDto {
  @ApiPropertyOptional({
    description: 'address',
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiPropertyOptional({
    description: 'cccd',
  })
  @IsOptional()
  @IsString()
  cccd: string;

  @ApiPropertyOptional({
    description: 'university',
  })
  @IsOptional()
  @IsString()
  university: string;

  @ApiPropertyOptional({
    description: 'faculty',
  })
  @IsOptional()
  @IsString()
  faculty: string;

  @ApiPropertyOptional({
    description: 'major',
  })
  @IsOptional()
  @IsString()
  major: string;

  @ApiPropertyOptional({
    description: 'status',
  })
  @IsOptional()
  @IsString()
  status: string;

  @ApiPropertyOptional({
    description: 'course',
  })
  @IsOptional()
  @IsString()
  course: string;

  @ApiPropertyOptional({
    description: 'gpa',
  })
  @IsOptional()
  gpa: number;

  @ApiPropertyOptional({
    description: 'card_student',
  })
  @IsOptional()
  @IsString()
  card_student: string;

  @ApiPropertyOptional({
    description: 'update_id',
  })
  @IsOptional()
  update_id: number;
}

// export class ConfirmStudentDto {
//   @ApiPropertyOptional({
//     description: '_id',
//   })
//   @IsOptional()
//   _id: number;

//   @ApiPropertyOptional({
//     description: 'id_account',
//   })
//   @IsOptional()
//   id_account: number;

//   @ApiPropertyOptional({
//     description: 'confirm_id',
//   })
//   @IsOptional()
//   confirm_id: number;
// }
