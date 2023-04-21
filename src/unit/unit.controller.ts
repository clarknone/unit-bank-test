import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from 'src/helper/guard/auth.guard';
import { IAuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAuthUser } from '../auth/interfaces/auth.interface';
import { GetAuthUser } from '../auth/decorators/user.decorators';

@UseGuards(JwtAuthGuard)
@Controller('unit')
export class UnitController {
  constructor(
    private readonly unitService: UnitService,
   
  ) {}

  @Post()
  create(@GetAuthUser() user: IAuthUser) {
   
    return this.unitService.apply(user);
  }

  @Get()
  findAll() {
    return this.unitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitService.update(+id, updateUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitService.remove(+id);
  }
}
