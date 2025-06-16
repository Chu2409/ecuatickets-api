import { ApiProperty } from '@nestjs/swagger'
import { CityResDto } from 'src/core/cities/dto/res/city.dto'
import { FrequencySegmentResDto } from 'src/core/frequency-segments/dto/res/frequency-segment.dto'

export class FrequencyResDto {
  @ApiProperty({
    description: 'Frequency ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Frequency time',
    example: '08:00:00',
  })
  time: string

  @ApiProperty({
    description: 'Frequency resolution',
    example: '24h',
  })
  resolution: string

  @ApiProperty({
    description: 'Is the frequency active?',
    example: true,
  })
  active: boolean

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Origin city information',
    type: CityResDto,
  })
  origin: CityResDto

  @ApiProperty({
    description: 'Destination city information',
    type: CityResDto,
  })
  destination: CityResDto

  @ApiProperty({
    description: 'Segment prices',
    type: [FrequencySegmentResDto],
  })
  segmentPrices: FrequencySegmentResDto[]
}
