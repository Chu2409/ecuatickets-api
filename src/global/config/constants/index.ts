import * as Joi from 'joi'
import { IConfig } from '../types'

export const config = (): { APP: IConfig } => ({
  APP: {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    DB_URL: process.env.DB_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MAIL_HOST: process.env.MAIL_HOST!,
    MAIL_USER: process.env.MAIL_USER!,
    MAIL_PASS: process.env.MAIL_PASS!,
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads/images',
    BASE_URL:
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  },
})

export const configValidationSchema = Joi.object<IConfig>({
  PORT: Joi.number().default(3000),
  DB_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  MAIL_HOST: Joi.string().required(),
  MAIL_USER: Joi.string().email().required(),
  MAIL_PASS: Joi.string().required(),
  UPLOAD_PATH: Joi.string().default('./uploads/images'),
  BASE_URL: Joi.string()
    .uri()
    .default(`http://localhost:${process.env.PORT || 3000}`),
})
