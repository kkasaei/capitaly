/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { WorkflowEngineService } from './workflow-engine.service';
import { Workflow, WorkflowExecution } from './types/workflow.types';

export interface WorkflowJob {
  id: string;
  workflow: Workflow;
}

export interface CronWorkflowJob extends WorkflowJob {
  cronExpression: string;
  timezone?: string;
}

@Processor('workflow')
export class WorkflowProcessor extends WorkerHost {
  private readonly logger = new Logger(WorkflowProcessor.name);

  constructor(private readonly workflowEngine: WorkflowEngineService) {
    super();
  }

  async process(
    job: Job<WorkflowJob | WorkflowJob[] | CronWorkflowJob>,
  ): Promise<any> {
    try {
      // Check job name to determine the type of job
      if (job.name === 'process-cron-workflow') {
        const cronWorkflow = job.data as CronWorkflowJob;
        this.logger.log(`Processing cron workflow with ID: ${cronWorkflow.id}`);
        this.logger.log(
          `Cron expression: ${cronWorkflow.cronExpression}, Timezone: ${cronWorkflow.timezone || 'UTC'}`,
        );

        const execution = await this.workflowEngine.executeWorkflow(
          cronWorkflow.workflow,
        );
        return { success: true, execution };
      }

      // Handle regular workflows
      const workflows = Array.isArray(job.data) ? job.data : [job.data];
      this.logger.log(`Processing ${workflows.length} workflow(s)`);

      const executions: WorkflowExecution[] = [];
      for (const workflow of workflows) {
        this.logger.log(`Processing workflow with ID: ${workflow.id}`);
        const execution = await this.workflowEngine.executeWorkflow(
          workflow.workflow,
        );
        executions.push(execution);
      }

      return { success: true, executions };
    } catch (error) {
      this.logger.error(
        `Error processing workflow job: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<WorkflowJob | WorkflowJob[]>) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<WorkflowJob | WorkflowJob[]>, error: Error) {
    this.logger.error(
      `Job ${job.id} failed with error: ${error.message}`,
      error.stack,
    );
  }
}
