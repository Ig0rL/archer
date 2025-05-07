import { Module } from '@nestjs/common';
import { CollisionCheckerService } from './collision-checker.service';
import { CollisionHandler } from './collision-handler.service';
import { MacroCommandModule } from '@/commands/macro-command/macro-command.module';
import { VectorModule } from '@/commands/vector/vector.module';

@Module({
	imports: [MacroCommandModule, VectorModule],
	providers: [CollisionCheckerService, CollisionHandler],
	exports: [CollisionCheckerService, CollisionHandler],
})
export class CollisionModule {}
