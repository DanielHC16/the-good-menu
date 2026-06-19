import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { MealsModule } from './meals/meals.module';
import { ProductsModule } from './products/products.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'password', // Password based on MySQL setup
      database: 'the_good_menu',
      autoLoadEntities: true,
      synchronize: true, // Auto-builds tables for local dev
    }),
    AuthModule,
    ProductsModule,
    MealsModule,
    SchedulesModule,
    AuditLogsModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
