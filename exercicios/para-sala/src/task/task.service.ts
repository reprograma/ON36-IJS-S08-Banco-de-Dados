import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../user/entities/user.entity';
import { Tag } from '../tag/entities/tag.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['user', 'tags'] });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['user', 'tags'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { userId, tagIds, ...taskData } = createTaskDto;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const tags = tagIds
      ? await this.tagsRepository.find({ where: { id: In(tagIds) } })
      : [];

    const newTask = this.tasksRepository.create({
      ...taskData,
      user,
      tags,
    });
    return this.tasksRepository.save(newTask);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.userId) {
      const user = await this.usersRepository.findOne({
        where: { id: updateTaskDto.userId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateTaskDto.userId} not found`,
        );
      }
      task.user = user;
    }

    if (updateTaskDto.tagIds) {
      const tags = await this.tagsRepository.find({
        where: { id: In(updateTaskDto.tagIds) },
      });
      task.tags = tags;
    }

    if (updateTaskDto.title) {
      task.title = updateTaskDto.title;
    }

    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
