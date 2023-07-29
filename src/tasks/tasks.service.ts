import { Injectable } from '@nestjs/common';
import { Task } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        ({ description, title }) =>
          description.includes(search) || title.includes(search),
      );
    }

    return tasks;
  }
  createTask(createTaskDto: CreateTaskDto): Task[] {
    const task = {
      id: uuidv4(),
      ...createTaskDto,
    };
    this.tasks.push(task);
    return this.tasks;
  }
  getTask(taskId: string): Task {
    const task = this.tasks.find(({ id }) => id === taskId);
    return task;
  }
  deleteTask(taskId: string): Task[] {
    const found = this.getTask(taskId);
    const tasks = this.tasks.filter(({ id }) => id !== found.id);
    this.tasks = tasks;
    return tasks;
  }
  updateTask(taskId: string, body: Partial<Pick<Task, 'status'>>): Task {
    const task = this.getTask(taskId);

    task.status = body.status;

    return task;
  }
}
