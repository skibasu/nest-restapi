import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length === 0) return this.taskService.getTasks();
    return this.taskService.getTasksWithFilters(filterDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Task[] {
    return this.taskService.createTask(createTaskDto);
  }
  @Get('/:id')
  getTask(@Param('id') id: string): Task {
    const found = this.taskService.getTask(id);
    if (!found) {
      throw new NotFoundException(`Taks with id ${id} not found.`);
    }
    return found;
  }
  @Delete('/:id')
  deleteTask(@Param('id') id: string): Task[] {
    return this.taskService.deleteTask(id);
  }
  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body(TaskStatusValidationPipe)
    body: Partial<Pick<Task, 'status'>>,
  ): Task {
    return this.taskService.updateTask(id, body);
  }
}
