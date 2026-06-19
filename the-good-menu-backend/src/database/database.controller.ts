import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seed')
export class DatabaseController {
  constructor(private readonly seederService: SeederService) {}

  @Post('all')
  seedAll() {
    return this.seederService.seedAll();
  }
}
