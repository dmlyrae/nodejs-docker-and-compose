import { HttpException } from '@nestjs/common';
import { HttpStatusCodes, THttpStatusCode } from 'src/constants/statusCodes';
import ErrorMessage from 'src/constants/errorMessages';

export class ServerException extends HttpException {
  public code: THttpStatusCode;

  constructor(code: THttpStatusCode) {
    super(
      ErrorMessage[code] ?? ErrorMessage[HttpStatusCodes.INTERNAL_SERVER_ERROR],
      code ?? HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );

    this.code = code;
  }
}
