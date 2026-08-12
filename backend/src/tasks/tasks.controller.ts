import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return await this.tasksService.getAllTasks();
  }

  @Post()
  async createTask(@Body() taskData: Partial<Task>): Promise<Task> {
    return await this.tasksService.createTask(taskData);
  }

  @Patch(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Task> {
    return await this.tasksService.updateStatus(id, status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.tasksService.remove(id);
  }
}