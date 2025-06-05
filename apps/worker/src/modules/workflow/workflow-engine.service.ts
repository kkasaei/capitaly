/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import {
  Workflow,
  WorkflowContext,
  WorkflowExecution,
  NodeExecution,
  WorkflowNode,
} from './types/workflow.types';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

@Injectable()
export class WorkflowEngineService {
  private readonly logger = new Logger(WorkflowEngineService.name);

  constructor(@InjectQueue('workflow') private readonly workflowQueue: Queue) {}

  async executeWorkflow(workflow: Workflow): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      id: (uuidv4 as () => string)(),
      workflowId: workflow.id,
      status: 'running',
      startedAt: new Date(),
      nodeExecutions: [],
    };

    try {
      // Create execution context
      const context: WorkflowContext = {
        workflow,
        execution,
        variables: {},
      };

      // Find start nodes (nodes with no incoming edges)
      const startNodes = this.findStartNodes(workflow);

      // Execute each start node and its subsequent nodes
      for (const startNode of startNodes) {
        await this.executeNode(startNode, context);
      }

      execution.status = 'completed';
      execution.completedAt = new Date();
    } catch (error: unknown) {
      this.logger.error(
        `Workflow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      execution.status = 'failed';
      execution.error =
        error instanceof Error ? error.message : 'Unknown error';
      execution.completedAt = new Date();
    }

    return execution;
  }

  private findStartNodes(workflow: Workflow): string[] {
    const nodeIds = new Set(workflow.nodes.map((node) => node.id));
    const targetNodeIds = new Set(workflow.edges.map((edge) => edge.target));

    return Array.from(nodeIds).filter((id) => !targetNodeIds.has(id));
  }

  private async executeNode(
    nodeId: string,
    context: WorkflowContext,
  ): Promise<void> {
    const node = context.workflow.nodes.find((n) => n.id === nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    // Create node execution record
    const nodeExecution: NodeExecution = {
      nodeId,
      status: 'running',
      startedAt: new Date(),
      input: { ...context.variables },
    };

    context.execution.nodeExecutions.push(nodeExecution);

    try {
      // Execute node based on its type
      const output = await this.executeNodeByType(node, context);

      // Update node execution
      nodeExecution.status = 'completed';
      nodeExecution.completedAt = new Date();
      nodeExecution.output = output;

      // Update context variables
      context.variables = {
        ...context.variables,
        ...output,
      };

      // Find and execute next nodes
      const nextNodes = this.findNextNodes(nodeId, context.workflow);
      for (const nextNode of nextNodes) {
        await this.executeNode(nextNode, context);
      }
    } catch (error) {
      this.logger.error(`Node execution failed: ${error.message}`, error.stack);
      nodeExecution.status = 'failed';
      nodeExecution.error = error.message;
      nodeExecution.completedAt = new Date();
      throw error;
    }
  }

  private findNextNodes(nodeId: string, workflow: Workflow): string[] {
    return workflow.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);
  }

  private async executeNodeByType(
    node: any,
    context: WorkflowContext,
  ): Promise<Record<string, any>> {
    // Add node execution logic based on node type
    // This is where you'll implement different node type handlers
    switch (node.type) {
      case 'http':
        if (!node.config?.url) {
          throw new Error('HTTP node must have a URL in its config');
        }
        return this.executeHttpNode({
          config: {
            url: node.config.url,
            method: node.config.method,
            headers: node.config.headers,
            body: node.config.body,
          },
        });
      case 'function':
        return this.executeFunctionNode(node, context);
      case 'condition':
        return this.executeConditionNode(node, context);
      default:
        throw new Error(`Unsupported node type: ${node.type}`);
    }
  }

  private async executeHttpNode(node: {
    config: {
      url: string;
      method?: string;
      headers?: Record<string, string>;
      body?: unknown;
    };
  }): Promise<Record<string, any>> {
    const { url, method = 'GET', headers = {}, body } = node.config;
    const response = await axios.request({
      url,
      method,
      headers,
      data: body,
    });
    return { response: response.data };
  }

  private async executeFunctionNode(
    node: WorkflowNode,
    context: WorkflowContext,
  ): Promise<Record<string, any>> {
    if (!node.data?.config?.function) {
      throw new Error('Function node must have a function in its config');
    }

    try {
      // Execute the function with the current context variables
      const fn = node.data.config.function as (
        variables: Record<string, any>,
      ) => Promise<any>;
      const result = await fn(context.variables);
      return { result };
    } catch (error) {
      this.logger.error(
        `Function node execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  private async executeConditionNode(
    node: WorkflowNode,
    context: WorkflowContext,
  ): Promise<Record<string, any>> {
    if (!node.data?.config?.condition) {
      throw new Error('Condition node must have a condition in its config');
    }

    try {
      // Evaluate the condition with the current context variables
      const condition = node.data.config.condition as (
        variables: Record<string, any>,
      ) => Promise<boolean>;
      const result = await condition(context.variables);
      return { result };
    } catch (error) {
      this.logger.error(
        `Condition node execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
