import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateDto } from './dto/updateDto';
import { RequestWithUserDto } from 'src/auth/auth.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('profile')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async find(@Request() req: RequestWithUserDto) {
    return await this.profilesService.find(req.user.id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() updateDto: UpdateDto,
    @Request() req: RequestWithUserDto,
  ) {
    return await this.profilesService.update(req.user.id, updateDto);
  }
}
