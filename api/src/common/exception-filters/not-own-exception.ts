import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { NotOwnComment } from './not-own-comment';

@Catch(NotOwnComment) // This is a Customised Business Logic Exception that we will THROW in service & @UseFilter() in controller
export class NotOwn implements ExceptionFilter { // The skeleton of this class is pasted from nest documentation
  catch(exception: NotOwnComment, host: ArgumentsHost) { // This row: Changed NotFoundComment -insted unknown
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: 404, // Changed this row
      timestamp: new Date().toISOString(),
      path: request.url, // Have to change this row, too /// moje da varna message-a, koito v Controllera se napisvashe bukvalno v str
      message: exception.message,
    });
  }
}