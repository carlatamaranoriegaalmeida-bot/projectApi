export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T | null;
  error?: any;
}

export const sendResponse = <T>(
  res: any,
  statusCode: number,
  message: string,
  data: T | null = null
) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
};
