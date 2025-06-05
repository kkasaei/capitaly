import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Workflow, WorkflowNode, WorkflowEdge } from '../types/workflow.types';

export class WorkflowDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  nodes: WorkflowNode[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  edges: WorkflowEdge[];

  @IsString()
  @IsNotEmpty()
  trigger: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  toEntity(): Workflow {
    return {
      id: this.id,
      name: this.name,
      nodes: this.nodes,
      edges: this.edges,
      trigger: { type: 'manual' },
      status: this.status as 'active' | 'inactive' | 'running' | 'failed',
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };
  }
} 