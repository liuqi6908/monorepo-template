import { Mixin } from 'ts-mixer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayNotEmpty, IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import type { ICreateUserBodyDto } from 'zjf-types'
import {
  VERIFICATION_COLLEGE_MAX,
  VERIFICATION_ID_CARD_MAX,
  VERIFICATION_ID_CARD_MIN,
  VERIFICATION_NUMBER_MAX,
  VERIFICATION_REJECT_REASON_MAX,
  VERIFICATION_REJECT_REASON_MIN,
  VERIFICATION_SCHOOL_MAX,
} from 'zjf-types'
import { AccountDto } from 'src/dto/account.dto'
import { EmailDto } from 'src/dto/email.dto'
import { PhoneOptionalDto } from 'src/dto/phone.dto'
import { PasswordOptionalDto } from 'src/dto/password.dto'
import { NicknameOptionalDto } from 'src/dto/nickname.dto'
import { VerifyStatusOptionalDto } from 'src/dto/verify-status.dto'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

export class CreateUserBodyDto
  extends Mixin(
    AccountDto,
    EmailDto,
    PhoneOptionalDto,
    PasswordOptionalDto,
    NicknameOptionalDto,
    VerifyStatusOptionalDto,
  )
  implements ICreateUserBodyDto {
  @ApiPropertyOptional({ description: '账号是否被删除' })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean

  @ApiPropertyOptional({
    description: `学校\n${sharedVariableMarkdown('VERIFICATION_SCHOOL_MAX', 'zjf-types', '最大长度')}`,
    maxLength: VERIFICATION_SCHOOL_MAX,
  })
  @IsString()
  @IsOptional()
  @MaxLength(VERIFICATION_SCHOOL_MAX)
  school?: string

  @ApiPropertyOptional({
    description: `学院\n${sharedVariableMarkdown('VERIFICATION_COLLEGE_MAX', 'zjf-types', '最大长度')}`,
    maxLength: VERIFICATION_COLLEGE_MAX,
  })
  @IsString()
  @IsOptional()
  @MaxLength(VERIFICATION_COLLEGE_MAX)
  college?: string

  @ApiPropertyOptional({
    description: `身份证号\n${sharedVariableMarkdown('VERIFICATION_ID_CARD_MAX', 'zjf-types', '最大长度')}\n${sharedVariableMarkdown('VERIFICATION_ID_CARD_MIN', 'zjf-types', '最小长度')}`,
    maxLength: VERIFICATION_ID_CARD_MAX,
    minLength: VERIFICATION_ID_CARD_MIN,
  })
  @IsString()
  @IsOptional()
  @MaxLength(VERIFICATION_ID_CARD_MAX)
  @MinLength(VERIFICATION_ID_CARD_MIN)
  idCard?: string

  @ApiPropertyOptional({
    description: `学号\n${sharedVariableMarkdown('VERIFICATION_NUMBER_MAX', 'zjf-types', '最大长度')}`,
    maxLength: VERIFICATION_NUMBER_MAX,
  })
  @IsString()
  @IsOptional()
  @MaxLength(VERIFICATION_NUMBER_MAX)
  number?: string

  @ApiPropertyOptional({ description: '真实姓名' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: '身份类型' })
  @IsString()
  @IsOptional()
  dataRole?: string

  @ApiPropertyOptional({
    description: '附件列表',
    type: [String],
  })
  @IsString({ each: true })
  @IsOptional()
  @ArrayNotEmpty()
  attachments?: string[]

  @ApiPropertyOptional({
    description: '驳回的原因',
    minLength: VERIFICATION_REJECT_REASON_MIN,
    maxLength: VERIFICATION_REJECT_REASON_MAX,
  })
  @IsOptional()
  @IsString()
  @MinLength(VERIFICATION_REJECT_REASON_MIN)
  @MaxLength(VERIFICATION_REJECT_REASON_MAX)
  rejectReason: string
}
