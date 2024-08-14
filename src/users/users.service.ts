import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { v4 as uuid } from 'uuid';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async create(newUser: UserDto) {
		const userAlreadyRegistered = await this.findByUsername(newUser.username);

		if (userAlreadyRegistered) {
			throw new ConflictException(`User '${newUser.username}' already exists`);
		}

		const dbUser = new UserEntity();
		dbUser.username = newUser.username;
		dbUser.password = bcryptHashSync(newUser.password, 10);
		const user = await this.userRepository.save(dbUser);

		return user;
	}

	async findByUsername(username: string): Promise<UserDto | null> {
		const user = await this.userRepository.findOne({
			where: { username }
		});

		if (!user) {
			return null
		}

		return user;
	}
}
