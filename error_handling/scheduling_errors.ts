import { StatusCodes } from 'http-status-codes';

import { ClientError } from './client_errors';

class SchedulingError extends ClientError {
  constructor(request: string) {
    super(`Error scheduling duty: ${request}`, StatusCodes.BAD_REQUEST);
  }
}

class CannotScheduleScheduledDutyError extends SchedulingError {
  constructor(request: string) {
    super(`Cannot schedule a duty which is already scheduled: ${request}`);
  }
}

class NotEnoughSoldiersForSchedulingDutyError extends SchedulingError {
  constructor(request: string) {
    super(`Cannot schedule a duty which is already scheduled: ${request}`);
  }
}

export {
  CannotScheduleScheduledDutyError,
  NotEnoughSoldiersForSchedulingDutyError,
};
