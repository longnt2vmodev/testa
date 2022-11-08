import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFieldDto {
  @ApiProperty({
    description: '_id',
  })
  @IsNotEmpty()
  _id: number;

  @ApiProperty({
    description: 'name_field',
  })
  @IsNotEmpty()
  nameField: string;
}
