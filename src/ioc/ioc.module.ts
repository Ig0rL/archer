import { Module } from '@nestjs/common';
import { IocService } from './ioc.service';
import { ExceptionsModule } from '@/exceptions/exceptions.module';
import { CommandsModule } from '@/commands/commands.module';

@Module({
  imports: [ExceptionsModule, CommandsModule],
  providers: [IocService],
  exports: [IocService],
})
export class IocModule {}
