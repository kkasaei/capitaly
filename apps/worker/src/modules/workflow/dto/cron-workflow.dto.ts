import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WorkflowDto } from './workflow.dto';

export class CronWorkflowDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ValidateNested()
  @Type(() => WorkflowDto)
  @IsNotEmpty()
  workflow: WorkflowDto;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
    {
      message:
        'Invalid cron syntax. Format should be "* * * * *" (minute hour day-of-month month day-of-week)',
    },
  )
  cronExpression: string;

  @IsString()
  @IsOptional()
  timezone?: string;
}
