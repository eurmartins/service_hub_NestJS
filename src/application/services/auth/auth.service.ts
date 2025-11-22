import * as common from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../domain/repositories/user.repository';
import { HashService } from '../user/hash.service';
import { AppLoggerService } from '../logger/logger.service';

@common.Injectable()
export class AuthService {
  constructor(
    @common.Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly logger: AppLoggerService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    this.logger.info(`Attempting login for email: ${email}`);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new common.UnauthorizedException('Invalid credentials');
    }
    this.logger.info(`User found for email: ${email}, validating password`);
    const isPasswordValid = await this.hashService.compare(
      password,
      user.hashPassword.toString(),
    );

    if (!isPasswordValid) {
      throw new common.UnauthorizedException('Invalid credentials');
    }
    this.logger.info(
      `Password validated for email: ${email}, generating token`,
    );
    const payload = { email: user.email.toString(), sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      return {
        id: user.id,
        email: user.email.toString(),
        active: user.active,
      };
    }
    return null;
  }
}
