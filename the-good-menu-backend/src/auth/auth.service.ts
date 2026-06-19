import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userFields } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      ...userFields,
      passwordHash,
    });

    return this.usersRepository.save(user);
  }

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
    const { password, ...userFields } = updateUserDto;
    const updatePayload: Record<string, unknown> = { ...userFields };

    if (password) {
      updatePayload.passwordHash = await bcrypt.hash(password, 10);
    }

    await this.findOne(id); // Verify user exists (throws NotFoundException)
    await this.usersRepository.update(id, updatePayload);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id); // Verify user exists (throws NotFoundException)
    await this.usersRepository.delete(id);

    return { message: `Record #${id} successfully deleted.` };
  }
}
