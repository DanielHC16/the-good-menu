import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // ─── Registration ──────────────────────────────────────────────────

  /**
   * Creates a new user. The password is auto-hashed by the
   * @BeforeInsert() hook on the User entity.
   */
  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    try {
      const user = this.usersRepository.create(registerDto);
      const saved = await this.usersRepository.save(user) as User;

      // Strip the password before returning
      const { password: _, ...result } = saved;
      void _;
      return result as Omit<User, 'password'>;
    } catch (error: any) {
      // MySQL duplicate entry error code
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('An account with this email already exists.');
      }
      throw error;
    }
  }

  // ─── Validation ────────────────────────────────────────────────────

  /**
   * Finds a user by email and compares the raw password against
   * the stored bcrypt hash. Returns the user (without password) on
   * success, or null on failure.
   */
  async validateUser(
    email: string,
    rawPassword: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(rawPassword, user.password);

    if (!isMatch) {
      return null;
    }

    const { password: _, ...result } = user;
    void _;
    return result as Omit<User, 'password'>;
  }

  // ─── JWT Issuance ──────────────────────────────────────────────────

  /**
   * Generates a signed JWT containing the user's ID and email.
   */
  async login(user: Omit<User, 'password'>): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ─── User CRUD (admin operations) ─────────────────────────────────

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User #${id} was not found.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User #${id} was not found.`);
    }

    await this.usersRepository.softRemove(user);

    return { message: `Record #${id} successfully deleted.` };
  }
}
