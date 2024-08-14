import {
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskStatusEnum } from './task.dto';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
	constructor(
		@InjectRepository(TaskEntity)
		private readonly taskRepository: Repository<TaskEntity>
	) {}

	private tasks: TaskDto[] = [];

	create(task: TaskDto) {
		const taskToSave: TaskEntity = {
			title: task.title,
			description: task.description,
			expirationDate: task.expirationDate,
			status: TaskStatusEnum.TO_DO
		}

		const 
	}

	findById(id: string): TaskDto {
		const task = this.tasks.filter((item) => item.id === id);

		if (task.length) {
			return task[0];
		}

		throw new NotFoundException(`Task with id ${id} not found`);
	}

	findAll(params: FindAllParameters): TaskDto[] {
		return this.tasks.filter((t) => {
			let match = true;

			if (params.title != undefined && !t.title.includes(params.title)) {
				match = false;
			}

			if (
				params.status != undefined &&
				!t.status.includes(params.status)
			) {
				match = false;
			}

			return match;
		});
	}

	update(task: TaskDto) {
		const taskIndex = this.tasks.findIndex((t) => t.id === task.id);

		if (taskIndex >= 0) {
			this.tasks[taskIndex] = task;
			return;
		}

		throw new HttpException('TASK_ID_NOT_FOUND', HttpStatus.NOT_FOUND);
	}

	remove(id: string) {
		const taskIndex = this.tasks.findIndex((t) => t.id === id);

		if (taskIndex >= 0) {
			this.tasks.splice(taskIndex, 1);
			return;
		}

		throw new HttpException('TASK_ID_NOT_FOUND', HttpStatus.NOT_FOUND);
	}
}
