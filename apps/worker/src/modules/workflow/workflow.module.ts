import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { WorkflowProcessor } from './workflow.processor';
import { WorkflowEngineService } from './workflow-engine.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'workflow',
    }),
  ],
  controllers: [WorkflowController],
  providers: [
    WorkflowService,
    WorkflowProcessor,
    WorkflowEngineService,
  ],
  exports: [WorkflowService, WorkflowEngineService],
})
export class WorkflowModule {}
