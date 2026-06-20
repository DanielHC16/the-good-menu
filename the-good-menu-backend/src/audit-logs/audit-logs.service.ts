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

  // Fetches all logs from the database (paginated)
  async findAll(page: number, limit: number): Promise<{
    data: AuditLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [logs, total] = await this.auditLogRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'DESC' },
    });
    const totalPages = Math.ceil(total / limit);
    return { data: logs, total, page, limit, totalPages };
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