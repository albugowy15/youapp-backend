import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { RequestWithUserDto } from 'src/auth/auth.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProfileDto, updateProfileSchema } from './profiles.dto';
import { ZodValidationPipe } from 'src/zod-validation.pipe';

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
  @UsePipes(new ZodValidationPipe(updateProfileSchema))
  async update(
    @Body() updateDto: UpdateProfileDto,
    @Request() req: RequestWithUserDto,
  ) {
    return await this.profilesService.update(req.user.id, updateDto);
  }
}
