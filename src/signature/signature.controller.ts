import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';

@UseGuards(JwtAuthGuard)
@Controller('signature')
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(/*@Body() dto: CreateSignatureDto*/) {
    return this.signatureService.createSignature({});
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.signatureService.getSignature(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string/*, @Body() dto: UpdateSignatureDto*/) {
    return this.signatureService.updateSignature(id, {});
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.signatureService.deleteSignature(id);
  }
} 