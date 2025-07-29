import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDTO {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;
  @IsNotEmpty()
  @ApiProperty({ example: 'password123' })
  password: string;
}

export class SignInDTO {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;
  @IsNotEmpty()
  @ApiProperty({ example: 'password123' })
  password: string;
}
