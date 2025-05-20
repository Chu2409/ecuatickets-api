import { ExecutionContext, SetMetadata } from '@nestjs/common'
import { ApiMessage as IApiMessage } from '../dtos/res/api-response.dto'
import { Reflector } from '@nestjs/core'

export const API_MESSAGE_METADATA = 'apiMessage'

export const ApiMessage = (messages: string | string[], displayable = true) =>
  SetMetadata<string, IApiMessage>(API_MESSAGE_METADATA, {
    content: Array.isArray(messages) ? messages : [messages],
    displayable,
  })

export const getApiMessage = (
  reflector: Reflector,
  context: ExecutionContext,
  defaultMessage: IApiMessage = {
    content: ['Successful operation'],
    displayable: false,
  },
) =>
  reflector.get<IApiMessage>(API_MESSAGE_METADATA, context.getHandler()) ||
  defaultMessage
