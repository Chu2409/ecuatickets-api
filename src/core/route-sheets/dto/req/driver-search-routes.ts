import { ApiProperty } from '@nestjs/swagger'
import { IsDate, ValidateIf } from 'class-validator'
import { Type } from 'class-transformer'

export class DriverSearchRoutesDto {
  @ApiProperty({
    description: 'Date of travel',
    example: new Date(),
  })
  @IsDate()
  @Type(() => Date)
  date: Date

  @ValidateIf(() => false)
  driverId: number
}
