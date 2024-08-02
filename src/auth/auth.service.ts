import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './auth.dto';
import { UserDto } from 'src/users/user.dto';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	private jwtExpirationTimeInSeconds: number;
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {
		this.jwtExpirationTimeInSeconds = +this.configService.get<number>(
			'JWT_EXPIRATION_TIME',
		);
	}

	signIn(username: string, password: string): AuthResponseDto {
		let user: UserDto;

		try {
			user = this.usersService.findByUsername(username);
		} catch (error) {
			throw new UnauthorizedException();
		}

		if (!user || !bcryptCompareSync(password, user.password)) {
			throw new UnauthorizedException();
		}

		const payload = { sub: user.id, username: user.username };

		const token = this.jwtService.sign(payload);

		return { token, experesIn: this.jwtExpirationTimeInSeconds };
	}
}
