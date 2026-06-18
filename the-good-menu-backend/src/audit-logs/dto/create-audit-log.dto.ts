import { Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @IsString()
  action!: string;

  @IsString()
  tableName!: string;

  @Type(() => Number)
  @IsInt()
  recordId!: number;

  @IsObject()
  changes!: Record<string, unknown>;
}
