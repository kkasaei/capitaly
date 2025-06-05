/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowJob } from './workflow.processor';
import { CronWorkflowDto } from './dto/cron-workflow.dto';

@Controller('workflows')
export class WorkflowController {
  private readonly logger = new Logger(WorkflowController.name);

  constructor(private readonly workflowService: WorkflowService) {
    this.logger.log('WorkflowController initialized');
  }

  @Get(':id')
  async processWorkflow(@Param('id') id: string) {
    this.logger.log(`Processing single workflow with ID: ${id}`);
    await this.workflowService.processWorkflow(id);
    return { success: true, message: `Workflow ${id} added to queue` };
  }

  @Get('job/:jobId')
  async getJobStatus(@Param('jobId') jobId: string) {
    this.logger.log(`Getting status for job: ${jobId}`);
    const status = await this.workflowService.getJobStatus(jobId);
    return { success: true, status };
  }

  @Post()
  async processWorkflows(
    @Body(new ValidationPipe({ transform: true })) workflows: WorkflowJob[],
  ) {
    this.logger.log(
      `Received request to process ${workflows.length} workflows`,
    );
    try {
      const result = await this.workflowService.processWorkflows(workflows);
      return {
        success: true,
        message: `${workflows.length} workflows added to queue`,
        jobId: result.jobId,
      };
    } catch (error) {
      this.logger.error(
        `Error processing workflows: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('cron')
  async processCronWorkflow(
    @Body(new ValidationPipe({ transform: true }))
    cronWorkflow: CronWorkflowDto,
  ) {
    this.logger.log(
      `Received request to process cron workflow with ID: ${cronWorkflow.id}`,
    );
    this.logger.log(
      `Cron expression: ${cronWorkflow.cronExpression}, Timezone: ${cronWorkflow.timezone || 'UTC'}`,
    );

    try {
      const result = await this.workflowService.processCronWorkflow(
        cronWorkflow.workflow.toEntity(),
        cronWorkflow.cronExpression,
        cronWorkflow.timezone,
      );
      return {
        success: true,
        message: `Cron workflow with ID: ${cronWorkflow.id} added to queue`,
        jobId: result.jobId,
        cronExpression: cronWorkflow.cronExpression,
        timezone: cronWorkflow.timezone || 'UTC',
      };
    } catch (error) {
      this.logger.error(
        `Error processing cron workflow: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
