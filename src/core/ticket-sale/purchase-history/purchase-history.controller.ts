import { Controller, Get } from '@nestjs/common'
import { PurchaseHistoryService } from './purchase-history.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { User } from '@prisma/client'
import { Auth } from 'src/core/auth/decorators/auth.decorator'
import { GetUser } from 'src/core/auth/decorators/get-user.decorator'
import { USER_ROLE } from 'src/core/users/types/user-role.enum'
import { TicketResDto } from './dto/ticket.dto'

@ApiTags('Purchase History (CUSTOMER)')
@Controller('purchase-history')
@ApiBearerAuth()
@Auth(USER_ROLE.CUSTOMER)
export class PurchaseHistoryController {
  constructor(
    private readonly purchaseHistoryService: PurchaseHistoryService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get user purchase history',
  })
  @ApiStandardResponse(TicketResDto)
  async getUserPurchaseHistory(@GetUser() user: User) {
    return this.purchaseHistoryService.getUserPurchaseHistory(user.id)
  }
}
