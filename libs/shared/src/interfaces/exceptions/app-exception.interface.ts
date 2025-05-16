export interface AppException {
  status: number;
  response: {
    error: string;
    message: string;
    statusCode: number;
  };
  options: Record<string, unknown>;
}
