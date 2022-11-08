import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCvDto {
  @ApiPropertyOptional({
    description: 'title',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'id_sv',
  })
  @IsNotEmpty()
  id_student: number;
}
