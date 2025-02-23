import { Module } from '@nestjs/common';
import { RotateChangeVelocityMacroService } from './rotate-change-velocity-macro.service';
import { RotateModule } from '@/commands/rotate/rotate.module';
import { ChangeVelocityCommandModule } from '@/commands/change-velocity-command/change-velocity-command.module';
import { MacroCommandModule } from '@/commands/macro-command/macro-command.module';

@Module({
  imports: [RotateModule, ChangeVelocityCommandModule, MacroCommandModule],
  providers: [RotateChangeVelocityMacroService]
})
export class RotateCheckVelocityMacroModule {}
