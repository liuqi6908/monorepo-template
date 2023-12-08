import { registerAs } from '@nestjs/config'

export interface ZstackConfig {
  host: string
  user: string
  password: string
}

export default registerAs('zstack', (): ZstackConfig => {
  return {
    host: process.env.ZSTACK_HOST,
    user: process.env.ZSTACK_USER,
    password: process.env.ZSTACK_PSWD,
  }
})
