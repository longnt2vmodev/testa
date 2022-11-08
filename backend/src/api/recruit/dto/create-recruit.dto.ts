import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRecruitDto {
  @ApiProperty({
    description: 'title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'way_working',
  })
  @IsNotEmpty()
  @IsString()
  way_working: string;

  @ApiProperty({
    description: 'salary',
  })
  @IsNotEmpty()
  salary: number;

  @ApiProperty({
    description: 'quantity',
  })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'level',
  })
  @IsNotEmpty()
  level: string;

  @ApiPropertyOptional({
    description: 'gender',
  })
  @IsOptional()
  gender: boolean | number;

  @ApiPropertyOptional({
    description: 'address_working',
  })
  @IsOptional()
  address_working: string;

  @ApiProperty({
    description: 'experience',
  })
  @IsNotEmpty()
  experience: number;

  @ApiPropertyOptional({
    description: 'description',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'requirement',
  })
  @IsNotEmpty()
  requirement: string;

  @ApiProperty({
    description: 'welfare',
  })
  @IsNotEmpty()
  welfare: string;

  @ApiProperty({
    description: 'start_date',
  })
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({
    description: 'end_date',
  })
  @IsNotEmpty()
  end_date: string;

  @ApiProperty({
    description: 'id_company',
  })
  @IsNotEmpty()
  id_company: number;

  @ApiProperty({
    description: 'list-field',
  })
  fields: number[];
}
