import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './schemas/todos.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async create(createTodoDto: CreateTodoDto) {
    const { name, description, isCompleted } = createTodoDto;
    const task = await this.todoModel.create({
      name,
      description,
      isCompleted,
    });

    return { message: 'Task Created Successfully', task };
  }

  async findAll() {
    return await this.todoModel.find();
  }

  async findOne(id: string) {
    const task = await this.todoModel.findById(id);

    if (!task) {
      throw new NotFoundException();
    }
    return { message: 'Task Found Successfully', task };
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const task = await this.todoModel.findById(id);

    if (!task) {
      throw new NotFoundException();
    }
    await this.todoModel.findByIdAndUpdate(id, {
      name: updateTodoDto.name,
      description: updateTodoDto.description,
      isCompleted: updateTodoDto.isCompleted,
    });

    return { message: 'Task Updated Successfully' };
  }

  async remove(id: string) {
    const task = await this.todoModel.findById(id);

    if (!task) {
      throw new NotFoundException();
    }

    await this.todoModel.deleteOne(task._id);
    return { message: 'Task Deleted Successfully' };
  }
}
