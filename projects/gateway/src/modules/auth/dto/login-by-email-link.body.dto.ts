import { Mixin } from 'ts-mixer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import type { ILoginByEmailLinkDto } from 'zjf-types'
import { EmailDto } from 'src/dto/email.dto'

export class LoginByEmailLinkDto
  extends Mixin(EmailDto)
  implements ILoginByEmailLinkDto {
  @ApiProperty({ description: '重定向的地址' })
  @IsString()
  redirect: string

  @ApiPropertyOptional({
    description: 'token 存储的参数名称',
    default: 'token',
    maxLength: 32,
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @MinLength(1)
  queryName?: string
}
