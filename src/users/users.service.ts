import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { v4 as uuid } from 'uuid';
import { hashSync as bcryptHashSync } from 'bcrypt';

@Injectable()
export class UsersService {
	private readonly users: UserDto[] = [];

	create(newUser: UserDto) {
		newUser.id = uuid();
		newUser.password = bcryptHashSync(newUser.password, 10);
		this.users.push(newUser);
	}

	findByUsername(username: string): UserDto {
		const user = this.users.find((user) => user.username === username);

		if (!user) {
			throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
		}

		return user;
	}
}
