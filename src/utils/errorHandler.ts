import { message } from 'antd';
import { ApiError } from '@/types';

export const handleApiError = (error: unknown): void => {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;
    const errorMessage = apiError.message || 'An unexpected error occurred';
    message.error(errorMessage);
  } else {
    message.error('An unexpected error occurred');
  }
};

export const formatApiError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;
    return apiError.message || 'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
};

