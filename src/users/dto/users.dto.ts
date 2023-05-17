import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, example: 18 })
  age: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'user@mail.com' })
  email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  avatar: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  status: boolean;
}
