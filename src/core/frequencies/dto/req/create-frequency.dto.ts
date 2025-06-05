import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator'

export class CreateFrequencyReqDto {
  @IsString()
  @IsNotEmpty()
  time: string

  @IsString()
  @IsNotEmpty()
  resolution: string

  active: boolean

  @IsNumber()
  @IsPositive()
  companyId: number

  @IsNumber()
  @IsPositive()
  originId: number

  @IsNumber()
  @IsPositive()
  destinationId: number
}
