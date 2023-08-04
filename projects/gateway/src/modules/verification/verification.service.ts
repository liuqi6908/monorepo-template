import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import type { User } from 'src/entities/user'
import { InjectRepository } from '@nestjs/typeorm'
import { responseError } from 'src/utils/response'
import { ErrorCode, VerificationStatus } from 'zjf-types'
import { VerificationHistory } from 'src/entities/verification'

import { UserService } from '../user/user.service'

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationHistory)
    private readonly _vhRepo: Repository<VerificationHistory>,
    private readonly _usrSrv: UserService,
  ) {}

  /**
   * 创建一个身份验证
   * @param founder
   * @param verificationBasicInfo
   * @returns
   */
  public async createVerification(
    founder: User | User['id'],
    verificationBasicInfo: Pick<VerificationHistory, 'name' | 'identify' | 'attachments'>,
  ) {
    const qr = await this._vhRepo.manager.connection.createQueryRunner()
    await qr.connect()
    await qr.startTransaction()
    try {
      const vh = this._vhRepo.create({
        founderId: typeof founder === 'string' ? founder : founder.id,
        ...verificationBasicInfo,
      })
      await qr.manager.save(vh)

      // 检查是否重复
      const count = await qr.manager.count(VerificationHistory, {
        where: {
          founderId: vh.founderId,
          status: VerificationStatus.PENDING,
        },
      })
      if (count > 1)
        throw new Error(String(ErrorCode.VERIFICATION_PENDING_EXISTS))

      await qr.commitTransaction()
      return vh
    }
    catch (err) {
      await qr.rollbackTransaction()
      if (err.message === String(ErrorCode.VERIFICATION_PENDING_EXISTS))
        responseError(ErrorCode.VERIFICATION_PENDING_EXISTS)
      responseError(ErrorCode.COMMON_UNEXPECTED_ERROR)
    }
    finally {
      await qr.release()
    }
  }

  /**
   * 更新身份验证的状态
   */
  public async updateVerificationStatus(
    verification: VerificationHistory,
    handler: User,
    status: VerificationStatus,
    rejectReason?: string,
  ) {
    // 禁用更新成 pending
    if (status === VerificationStatus.PENDING)
      throw new Error('无法将身份验证状态设置为待处理')
    // 跳过相同状态
    if (verification.status === status)
      return verification
    // 不允许驳回时没有驳回原因
    if (status === VerificationStatus.REJECTED && !rejectReason)
      responseError(ErrorCode.VERIFICATION_REJECT_REASON_REQUIRED)
    // 仅允许用户自己取消
    if (status === VerificationStatus.CANCELLED && verification.founderId !== handler.id)
      responseError(ErrorCode.PERMISSION_DENIED)
    // 仅允许管理员处理
    // 应该在 controller 层处理

    await this._vhRepo.update(verification.id, {
      status,
      rejectReason,
      handlerId: handler.id,
      handledAt: new Date(),
    })

    // 更新用户的认证状态
    if (status === VerificationStatus.APPROVED) {
      await this._usrSrv
        .repo()
        .update({ id: verification.founderId }, { verificationId: verification.id })
    }

    if (status === VerificationStatus.CANCELLED && handler.verificationId === verification.id) {
      await this._usrSrv
        .repo()
        .update({ id: verification.founderId }, { verificationId: null })
    }

    return await this._vhRepo.findOne({ where: { id: verification.id } })
  }

  /**
   * 查找指定用户最新的一条身份验证
   * @param founderId
   * @returns
   */
  public async getLatestVerificationByFounderId(founderId: User['id']) {
    return await this._vhRepo.findOne({
      where: { founderId },
      order: { createdAt: 'DESC' },
    })
  }

  public async getVerificationHistoryOfUser(founderId: User['id']) {
    return await this._vhRepo.find({ where: { founderId } })
  }

  public async getAllVerificationHistory() {
    return await this._vhRepo.find()
  }

  public repo() {
    return this._vhRepo
  }

  public qb(alias = 'vh') {
    return this._vhRepo.createQueryBuilder(alias)
  }
}
