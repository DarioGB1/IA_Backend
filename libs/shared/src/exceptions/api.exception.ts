export class ApiException {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
  ) {}

  static notFound(message = 'Resource not found') {
    return new ApiException(message, 404);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiException(message, 401);
  }

  static badRequest(message = 'Bad request') {
    return new ApiException(message, 400);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiException(message, 403);
  }

  static internal(message = 'Internal server error') {
    return new ApiException(message, 500);
  }
}
