import {
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskStatusEnum } from './task.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TaskService {
	private tasks: TaskDto[] = [];

	create(task: TaskDto) {
		task.id = uuid();
		task.status = TaskStatusEnum.TO_DO
		this.tasks.push(task);
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
