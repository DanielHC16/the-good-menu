import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  // Inject the TypeORM repository for Audit Logs
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  // Saves a new log to the database
  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const newLog = this.auditLogRepository.create(createAuditLogDto);
    return await this.auditLogRepository.save(newLog);
  }

  // Fetches all logs from the database
  async findAll(): Promise<AuditLog[]> {
    return await this.auditLogRepository.find();
  }

  // Fetches a single log by its ID
  async findOne(id: number): Promise<AuditLog> {
    const log = await this.auditLogRepository.findOne({ where: { id } });
    if (!log) {
      throw new NotFoundException(`Audit log #${id} not found`);
    }
    return log;
  }

  // ECURITY NOTE: Audit logs should generally be immutable! 
  // We do not implement real update/delete logic here to protect the trail.
  update(id: number, updateAuditLogDto: UpdateAuditLogDto) {
    void updateAuditLogDto;
    return `Security Warning: Updating audit log #${id} is not permitted.`;
  }

  remove(id: number) {
    return `Security Warning: Deleting audit log #${id} is not permitted.`;
  }
}