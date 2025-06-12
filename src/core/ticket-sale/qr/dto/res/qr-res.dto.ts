import { ApiProperty } from '@nestjs/swagger'

export class QrResDto {
  @ApiProperty({
    description: 'Código QR en formato base64',
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNAIG1hZ2VudGEAAAAAAAAAAAAAAQ...',
  })
  qr: string
}
