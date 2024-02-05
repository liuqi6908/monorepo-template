import { registerAs } from '@nestjs/config'

export interface HyperVConfig {
  host: string
  user: string
  password: string
}

export default registerAs('hyperV', (): HyperVConfig => {
  return {
    host: process.env.HYPER_V_HOST,
    user: process.env.HYPER_V_USER,
    password: process.env.HYPER_V_PSWD,
  }
})
