import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiPromptService } from './ai-prompt.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('ai-prompt')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-prompt')
export class AiPromptController {
  constructor(private readonly service: AiPromptService) {}

  @ApiOperation({ summary: '获取项目的完整 AI 评审提示词（可COPY发给 LLM）' })
  @Get('project/:id')
  buildProjectPrompt(@Param('id') id: string) {
    return this.service.buildProjectPrompt(id);
  }

  @ApiOperation({ summary: '根据场景获取选型推荐（一键对接推荐引擎）' })
  @Get('recommend/:scene')
  recommend(@Param('scene') scene: string) {
    return this.service.recommend(decodeURIComponent(scene));
  }
}
