/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { WorkflowJob, CronWorkflowJob } from './workflow.processor';
import { Workflow } from './types/workflow.types';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(@InjectQueue('workflow') private readonly workflowQueue: Queue) {
    this.logger.log('WorkflowService initialized');
  }

  async getJobStatus(jobId: string): Promise<{
    id: string;
    status: string;
    progress?: number;
    result?: any;
    error?: string;
  }> {
    try {
      const job = (await this.workflowQueue.getJob(jobId)) as Job<
        WorkflowJob | WorkflowJob[] | CronWorkflowJob
      >;
      if (!job) {
        throw new Error(`Job ${jobId} not found`);
      }

      const state = await job.getState();
      let result;
      let failedReason;

      try {
        result = job.finishedOn;
      } catch {
        // Job is still in progress or failed
        result = undefined;
      }

      try {
        failedReason = job.failedReason;
      } catch {
        failedReason = undefined;
      }

      return {
        id: job.id ?? '',
        status: state,
        progress: Number(job.progress),
        result,
        error: failedReason,
      };
    } catch (error) {
      this.logger.error(
        `Error getting job status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async processWorkflow(id: string): Promise<{ jobId: string }> {
    this.logger.log(`Adding workflow with ID: ${id} to queue`);

    const job: WorkflowJob = {
      id,
      workflow: await this.getWorkflowById(id),
    };

    const queueJob = await this.workflowQueue.add('process-workflow', job);
    return { jobId: queueJob.id || '' };
  }

  private async getWorkflowById(id: string): Promise<Workflow> {
    // TODO: Implement actual workflow fetching from database
    throw new Error('Not implemented');
  }

  async processWorkflows(workflows: WorkflowJob[]): Promise<{ jobId: string }> {
    this.logger.log(`Adding ${workflows.length} workflows to queue`);

    // Validate workflows
    if (!workflows || !Array.isArray(workflows) || workflows.length === 0) {
      throw new Error('Invalid workflows array');
    }

    // Add batch of workflows to the queue
    const job = await this.workflowQueue.add('process-workflows', workflows);
    return { jobId: job.id || '' };
  }

  async processCronWorkflow(
    workflow: Workflow,
    cronExpression: string,
    timezone?: string,
  ): Promise<{ jobId: string }> {
    this.logger.log(`Adding cron workflow with ID: ${workflow.id} to queue`);
    this.logger.log(
      `Cron expression: ${cronExpression}, Timezone: ${timezone || 'UTC'}`,
    );

    // Validate cron workflow
    if (!workflow || !workflow.id || !cronExpression) {
      throw new Error('Invalid cron workflow data');
    }

    const cronJob: CronWorkflowJob = {
      id: workflow.id,
      workflow,
      cronExpression,
      timezone,
    };

    // Add cron workflow to the queue with repeat options
    const job = await this.workflowQueue.add('process-cron-workflow', cronJob, {
      repeat: {
        pattern: cronExpression,
        tz: timezone || 'UTC',
      },
    });

    return { jobId: job.id || '' };
  }
}
