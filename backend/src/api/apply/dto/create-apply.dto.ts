import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateApplyDto {
  @ApiProperty({
    description: 'id_student',
    example: 1,
  })
  @IsNotEmpty()
  id_student: number;

  @ApiProperty({
    description: 'id_recruit',
    example: 1,
  })
  @IsNotEmpty()
  id_recruit: number;
}
