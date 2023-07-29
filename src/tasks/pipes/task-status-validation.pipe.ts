import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();
    if (!this.isStatusValid(status)) throw new BadRequestException();
    return value;
  }
  private isStatusValid(value: any) {
    return this.allowedStatuses.includes(value);
  }
}
