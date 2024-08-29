import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Task } from '../task/entities/task.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagsRepository.find({ relations: ['tasks'] });
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const { taskIds, ...tagData } = createTagDto;

    const tasks = taskIds
      ? await this.tasksRepository.find({ where: { id: In(taskIds) } })
      : [];

    const newTag = this.tagsRepository.create({
      ...tagData,
      tasks,
    });
    return this.tagsRepository.save(newTag);
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    if (updateTagDto.taskIds) {
      const tasks = await this.tasksRepository.find({
        where: { id: In(updateTagDto.taskIds) },
      });
      tag.tasks = tasks;
    }

    if (updateTagDto.title) {
      tag.title = updateTagDto.title;
    }

    return this.tagsRepository.save(tag);
  }

  async remove(id: string): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagsRepository.remove(tag);
  }
}
