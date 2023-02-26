import { StatusCodes } from 'http-status-codes';

class ClientError extends Error {
  public code: StatusCodes;

  constructor(request: string, code: StatusCodes) {
    super(request);
    this.code = code;
  }
}

class DocumentNotFoundError extends ClientError {
  constructor(request: string) {
    super(`Document not found for: ${request}`, StatusCodes.NOT_FOUND);
  }
}

class CannotModifyAssignedDutyError extends ClientError {
  constructor(request: string) {
    super(
      `Cannot modify a duty which is assigned: ${request}`,
      StatusCodes.BAD_REQUEST,
    );
  }
}

export { ClientError, DocumentNotFoundError, CannotModifyAssignedDutyError };
