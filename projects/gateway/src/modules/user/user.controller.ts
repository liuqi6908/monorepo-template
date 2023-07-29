import { IsLogin } from 'src/guards/login.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/utils/response'
import { Body, Controller, Get, Put, Req } from '@nestjs/common'
import { emailPhoneAtLeastOne } from 'src/utils/validator/email-phone-at-least-one'

import { UserService } from './user.service'
import { UserProfileResponseDto } from './dto/user.res.dto'
import { CreateUserResDto } from './dto/create-user.res.dto'
import { CreateUserBodyDto } from './dto/create-user.body.dto'

@ApiTags('User | 用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly _userSrv: UserService,
  ) {}

  @ApiOperation({ summary: '创建一个新用户' })
  @ApiSuccessResponse(CreateUserResDto)
  @Put('create')
  public async createUser(@Body() body: CreateUserBodyDto) {
    emailPhoneAtLeastOne(body)
    return await this._userSrv.insertUser(body)
  }

  @ApiOperation({ summary: '获取当前登录用户的信息' })
  @ApiSuccessResponse(UserProfileResponseDto)
  @IsLogin()
  @Get('profile/own')
  public async getOwnProfile(@Req() req: FastifyRequest) {
    return req.raw.user
  }
}