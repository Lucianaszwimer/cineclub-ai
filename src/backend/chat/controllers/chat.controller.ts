import { Body, Controller, Get, Inject, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { getSessionParamsSchema, PostChatDto, postChatSchema } from '../dto/chat.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { HandleChatUseCase } from '../use-cases/handle-chat.usecase';
import { GetSessionUseCase } from '../use-cases/get-session.usecase';
import { InternalApiKeyGuard } from '../../common/interceptors/internal-api-key.guard';

@Controller('chat')
@UseGuards(InternalApiKeyGuard)
export class ChatController {
  constructor(
    @Inject(HandleChatUseCase) private readonly handleChatUseCase: HandleChatUseCase,
    @Inject(GetSessionUseCase) private readonly getSessionUseCase: GetSessionUseCase
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(postChatSchema))
  async postChat(@Body() body: PostChatDto) {
    return this.handleChatUseCase.execute(body.messages, body.sessionId);
  }

  @Get(':id')
  @UsePipes(new ZodValidationPipe(getSessionParamsSchema))
  async getChatById(@Param() params: { id: string }) {
    return this.getSessionUseCase.execute(params.id);
  }
}
