import { Injectable, Logger } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { MailService } from '../mail/mail.service';

/**
 * The Watchtower – a TypeORM EventSubscriber that automatically:
 *  1. Writes an AuditLog record for every INSERT / UPDATE / DELETE / SOFT_DELETE.
 *  2. Fires an email alert via MailService immediately after.
 *
 * Safety mechanisms:
 *  • Skips logging when IS_SEEDING === 'true' (anti-spam for seed scripts).
 *  • Skips logging when the modified entity IS an AuditLog (infinite-loop guard).
 */
@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<any> {
  private readonly logger = new Logger(AuditSubscriber.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {
    // Manually register this subscriber with the DataSource so TypeORM
    // dispatches entity events to our methods.
    dataSource.subscribers.push(this);
  }

  // ─── Safety checks ─────────────────────────────────────────────────

  /**
   * Returns `true` when the event should be silently ignored.
   *  - During database seeding (IS_SEEDING flag).
   *  - When the entity being modified is AuditLog itself (prevents infinite recursion).
   */
  private shouldSkip(entity: any, entityClass: Function | undefined): boolean {
    // Anti-spam: seeder is running
    if (process.env.IS_SEEDING === 'true') {
      return true;
    }

    // Infinite-loop guard: never audit the audit table
    if (entityClass === AuditLog || entity instanceof AuditLog) {
      return true;
    }

    return false;
  }

  // ─── Core persistence + notification ───────────────────────────────

  private async logAndNotify(
    action: string,
    tableName: string,
    recordId: number,
    changes: Record<string, unknown>,
  ): Promise<void> {
    // Persist the audit record via a fresh repository to avoid event re-entry
    const auditRepo = this.dataSource.getRepository(AuditLog);
    const log = auditRepo.create({
      action,
      tableName,
      recordId,
      changes,
    });
    await auditRepo.save(log);

    this.logger.log(`Audit logged → ${action} on ${tableName} #${recordId}`);

    // Fire email alert (non-blocking — errors are caught inside MailService)
    this.mailService
      .sendAuditAlert(action, tableName, recordId, changes)
      .then(() => {
        this.logger.log(
          `Audit email sent → ${action} on ${tableName} #${recordId}`,
        );
      })
      .catch((error) => {
        this.logger.error('Failed to send audit email (Non-blocking)', error);
      });
  }

  // ─── TypeORM event hooks ──────────────────────────────────────────

  afterInsert(event: InsertEvent<any>): Promise<void> | void {
    const entity = event.entity;
    if (
      !entity ||
      this.shouldSkip(entity, event.metadata?.target as Function | undefined)
    ) {
      return;
    }

    const tableName = event.metadata.tableName;
    const recordId = entity.id ?? 0;
    const changes = { ...entity };

    return this.logAndNotify('INSERT', tableName, recordId, changes);
  }

  afterUpdate(event: UpdateEvent<any>): Promise<void> | void {
    const entity = event.entity;
    if (
      !entity ||
      this.shouldSkip(entity, event.metadata?.target as Function | undefined)
    ) {
      return;
    }

    const tableName = event.metadata.tableName;
    const recordId = (entity as any).id ?? 0;

    // Build a diff from TypeORM's updatedColumns when available
    const changes: Record<string, unknown> = {};
    if (event.updatedColumns && event.updatedColumns.length > 0) {
      for (const col of event.updatedColumns) {
        changes[col.propertyName] = col.getEntityValue(entity);
      }
    } else {
      Object.assign(changes, entity);
    }

    return this.logAndNotify('UPDATE', tableName, recordId, changes);
  }

  afterRemove(event: RemoveEvent<any>): Promise<void> | void {
    const entity = event.entity;
    if (
      !entity ||
      this.shouldSkip(entity, event.metadata?.target as Function | undefined)
    ) {
      return;
    }

    const tableName = event.metadata.tableName;
    const recordId = entity.id ?? event.entityId ?? 0;
    const changes = { ...entity };

    return this.logAndNotify('DELETE', tableName, recordId, changes);
  }

  afterSoftRemove(event: SoftRemoveEvent<any>): Promise<void> | void {
    const entity = event.entity;
    if (
      !entity ||
      this.shouldSkip(entity, event.metadata?.target as Function | undefined)
    ) {
      return;
    }

    const tableName = event.metadata.tableName;
    const recordId = entity.id ?? event.entityId ?? 0;
    const changes = { ...entity };

    return this.logAndNotify('SOFT_DELETE', tableName, recordId, changes);
  }
}
