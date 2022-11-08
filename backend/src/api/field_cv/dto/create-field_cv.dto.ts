import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFieldCvDto {
  @ApiProperty({
    description: 'id_field',
  })
  @IsNotEmpty()
  id_field_array: number[];

  @ApiProperty({
    description: 'id_cv',
  })
  @IsNotEmpty()
  id_cv: number;
}
