import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { FrequencySegmentsService } from './frequency-segments.service'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { CreateFrequencySegmentReqDto } from './dto/req/create-frequency-segment.dto'
import { UpdateFrequencySegmentReqDto } from './dto/req/update-frequency-segment.dto'
import { USER_ROLE } from '../users/types/user-role.enum'

@ApiTags('Frequency Segments')
@Controller('frequency-segments')
@ApiBearerAuth()
@Auth(USER_ROLE.ADMIN)
export class FrequencySegmentsController {
  constructor(private readonly service: FrequencySegmentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new frequency segment',
  })
  @ApiStandardResponse()
  create(@Body() dto: CreateFrequencySegmentReqDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a frequency segment by id',
  })
  @ApiStandardResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFrequencySegmentReqDto,
  ) {
    return this.service.update(id, dto)
  }
}
