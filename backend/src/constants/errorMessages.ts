import { THttpStatusCode, HttpStatusCodes } from './statusCodes';

const ErrorMessage: Record<THttpStatusCode, string> = {
  [HttpStatusCodes.CONTINUE]: 'Continue',
  [HttpStatusCodes.SWITCHING_PROTOCOLS]: 'Switching protocols',
  [HttpStatusCodes.OK]: 'OK',
  [HttpStatusCodes.CREATED]: 'Created',
  [HttpStatusCodes.ACCEPTED]: 'Accepted',
  [HttpStatusCodes.NON_AUTHORITATIVE_INFORMATION]:
    'Non-authoritative information',
  [HttpStatusCodes.NO_CONTENT]: 'No content',
  [HttpStatusCodes.RESET_CONTENT]: 'Reset content',
  [HttpStatusCodes.PARTIAL_CONTENT]: 'Partial content',
  [HttpStatusCodes.MULTIPLE_CHOICES]: 'Multiple choices',
  [HttpStatusCodes.MOVED_PERMANENTLY]: 'Moved permanently',
  [HttpStatusCodes.FOUND]: 'Found',
  [HttpStatusCodes.SEE_OTHER]: 'See other',
  [HttpStatusCodes.NOT_MODIFIED]: 'Not modified',
  [HttpStatusCodes.USE_PROXY]: 'Use proxy',
  [HttpStatusCodes.TEMPORARY_REDIRECT]: 'Temporary redirect',
  [HttpStatusCodes.BAD_REQUEST]: 'Bad request',
  [HttpStatusCodes.UNAUTHORIZED]: 'Auth required',
  [HttpStatusCodes.FORBIDDEN]: 'Access forbidden',
  [HttpStatusCodes.NOT_FOUND]: 'Not found',
  [HttpStatusCodes.METHOD_NOT_ALLOWED]: 'Method not allowed',
  [HttpStatusCodes.NOT_ACCEPTABLE]: 'Not acceptable',
  [HttpStatusCodes.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [HttpStatusCodes.NOT_IMPLEMENTED]: 'Not implemented',
  [HttpStatusCodes.BAD_GATEWAY]: 'Bad gateway',
  [HttpStatusCodes.SERVICE_UNAVAILABLE]: 'Service unavailable',
  [HttpStatusCodes.CONFLICT]: 'Allready exist',
};

export default ErrorMessage;
