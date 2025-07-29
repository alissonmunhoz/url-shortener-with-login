import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UrlDTO {
  @IsUrl({ require_protocol: true }, { message: 'URL must include https://' })
  @ApiProperty()
  @IsNotEmpty()
  url: string;
}
