import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: 'To Do' })
  status: string;

  @Column({ default: 'Medium' })
  priority: string;

  @Column()
  dueDate: string;

  @Column({ default: 'Guest' })
  assignee: string;

  @CreateDateColumn()
  createdAt: Date;
}