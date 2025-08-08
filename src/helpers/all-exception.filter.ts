import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    console.log(exception);    

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      if (status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        response.status(status).json(exception.getResponse());
        return;
      }
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : JSON.stringify(exceptionResponse);
      error = this.getErrorMessage(status);
    } 
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST; 
      message = 'Database error: ' + exception.message;
      error = this.getErrorMessage(status);
    }

    const errorResponse = {
      statusCode: status,
      error,  
      message,
    };

    this.logger.error(
      `Status: ${status} Error: ${message} Path: ${request.url}`,
    );
    this.logger.error(
      exception
    );

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(status: HttpStatus): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }
}
