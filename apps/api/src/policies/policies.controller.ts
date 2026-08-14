import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt/jwt.guard';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PoliciesService } from './policies.service';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class PoliciesController {
  constructor(
    private readonly policiesService: PoliciesService,
  ) {}

  @Get('clients/:clientId/policies')
  async findByClient(
    @Req() request: any,
    @Param('clientId') clientId: string,
  ) {
    return this.policiesService.findByClient(
      request.user.sub,
      clientId,
    );
  }

  @Get('policies/:id')
  async findOne(
    @Req() request: any,
    @Param('id') id: string,
  ) {
    return this.policiesService.findOne(
      request.user.sub,
      id,
    );
  }

  @Post('clients/:clientId/policies')
  async create(
    @Req() request: any,
    @Param('clientId') clientId: string,
    @Body() dto: CreatePolicyDto,
  ) {
    return this.policiesService.create(
      request.user.sub,
      clientId,
      dto,
    );
  }
}