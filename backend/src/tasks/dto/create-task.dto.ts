import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Task title is required' })
  @IsString()
  title!: string;

  @IsOptional()
  @IsIn(['To Do', 'In Progress', 'Completed'])
  status?: string;

  @IsOptional()
  @IsIn(['Low', 'Medium', 'High'])
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assignee?: string;
}