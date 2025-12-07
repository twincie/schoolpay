export const successResponse = (res: any, message: string, data: any = null, statusCode: number = 200): void => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

export const errorResponse = (res: any, message: string, statusCode: number = 400): void => {
  res.status(statusCode).json({
    status: 'error',
    message,
  });
};