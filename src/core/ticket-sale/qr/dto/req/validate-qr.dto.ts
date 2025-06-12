import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ValidateQrReqDto {
  @ApiProperty({
    description: 'Código de acceso del boleto',
    example: '2031A8DB2CB5',
  })
  @IsString()
  accessCode: string
}
