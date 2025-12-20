import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/dto/create-auth.dto';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.todosService.create(createTodoDto, userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.todosService.findAll(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
