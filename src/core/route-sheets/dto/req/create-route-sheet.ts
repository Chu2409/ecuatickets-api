import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { ROUTE_STATUS } from '../../types/route-status.enum'
import { ROUTE_MODE } from '../../types/route-mode.enum'
import { Type } from 'class-transformer'

export class CreateRouteSheetDto {
  @ApiProperty({
    description: 'The date of the route sheet',
    example: '2025-06-16',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date

  @ApiProperty({
    description: 'The status of the route sheet',
    example: ROUTE_STATUS.GENERATED,
  })
  @IsNotEmpty()
  @IsEnum(ROUTE_STATUS)
  status: ROUTE_STATUS

  @ApiProperty({
    description: 'The mode of the route sheet',
    example: ROUTE_MODE.AUTOMATIC,
  })
  @IsNotEmpty()
  @IsEnum(ROUTE_MODE)
  mode: ROUTE_MODE

  @ApiProperty({
    description: 'The frequency id',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  frequencyId: number

  @ApiProperty({
    description: 'The bus id',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  busId: number
}
