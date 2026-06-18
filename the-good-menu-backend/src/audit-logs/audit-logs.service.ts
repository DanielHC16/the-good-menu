import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Injectable()
export class AuditLogsService {
  create(createAuditLogDto: CreateAuditLogDto) {
    void createAuditLogDto;
    return 'This action adds a new audit log';
  }

  findAll() {
    return 'This action returns all audit logs';
  }

  findOne(id: number) {
    return `This action returns a #${id} audit log`;
  }

  update(id: number, updateAuditLogDto: UpdateAuditLogDto) {
    void updateAuditLogDto;
    return `This action updates a #${id} audit log`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit log`;
  }
}
