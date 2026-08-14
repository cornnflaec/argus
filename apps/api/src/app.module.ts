import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { DatabaseModule } from './database/database.module';
import { ImportModule } from './import/import.module';
import { PoliciesModule } from './policies/policies.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ClientsModule,
    PoliciesModule,
    ImportModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}