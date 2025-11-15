import { AppwriteException } from 'appwrite';

/**
 * Custom Appwrite error class with additional context
 */
export class AppwriteError extends Error {
  public readonly code: number;
  public readonly type: string;
  public readonly response?: any;

  constructor(message: string, code: number = 500, type: string = 'unknown', response?: any) {
    super(message);
    this.name = 'AppwriteError';
    this.code = code;
    this.type = type;
    this.response = response;
  }

  /**
   * Create from an Appwrite exception
   */
  static fromException(exception: AppwriteException): AppwriteError {
    return new AppwriteError(
      exception.message,
      exception.code || 500,
      exception.type || 'appwrite_error',
      exception.response,
    );
  }

  /**
   * Create a network error
   */
  static networkError(message: string = 'Network request failed'): AppwriteError {
    return new AppwriteError(message, 0, 'network_error');
  }

  /**
   * Create an authentication error
   */
  static authError(message: string = 'Authentication failed'): AppwriteError {
    return new AppwriteError(message, 401, 'auth_error');
  }

  /**
   * Create a permission error
   */
  static permissionError(message: string = 'Permission denied'): AppwriteError {
    return new AppwriteError(message, 403, 'permission_error');
  }

  /**
   * Create a not found error
   */
  static notFoundError(message: string = 'Resource not found'): AppwriteError {
    return new AppwriteError(message, 404, 'not_found_error');
  }

  /**
   * Create a validation error
   */
  static validationError(message: string = 'Validation failed'): AppwriteError {
    return new AppwriteError(message, 400, 'validation_error');
  }

  /**
   * Create a rate limit error
   */
  static rateLimitError(message: string = 'Rate limit exceeded'): AppwriteError {
    return new AppwriteError(message, 429, 'rate_limit_error');
  }

  /**
   * Create a server error
   */
  static serverError(message: string = 'Internal server error'): AppwriteError {
    return new AppwriteError(message, 500, 'server_error');
  }
}

/**
 * Type guard to check if an error is an AppwriteError
 */
export const isAppwriteError = (error: unknown): error is AppwriteError => {
  return error instanceof AppwriteError;
};

/**
 * Type guard to check if an error is an AppwriteException
 */
export const isAppwriteException = (error: unknown): error is AppwriteException => {
  return error instanceof AppwriteException;
};

/**
 * Convert any error to an AppwriteError
 */
export const toAppwriteError = (error: unknown): AppwriteError => {
  if (isAppwriteError(error)) {
    return error;
  }

  if (isAppwriteException(error)) {
    return AppwriteError.fromException(error);
  }

  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('Network')) {
      return AppwriteError.networkError(error.message);
    }
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      return AppwriteError.authError(error.message);
    }
    if (error.message.includes('403') || error.message.includes('forbidden')) {
      return AppwriteError.permissionError(error.message);
    }
    if (error.message.includes('404') || error.message.includes('not found')) {
      return AppwriteError.notFoundError(error.message);
    }
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return AppwriteError.rateLimitError(error.message);
    }

    return new AppwriteError(error.message, 500, 'unknown_error');
  }

  if (typeof error === 'string') {
    return new AppwriteError(error, 500, 'unknown_error');
  }

  return new AppwriteError('An unknown error occurred', 500, 'unknown_error');
};

/**
 * Error handler for async operations
 */
export const handleAppwriteError = async <T>(
  operation: () => Promise<T>,
  errorHandler?: (error: AppwriteError) => void,
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const appwriteError = toAppwriteError(error);

    if (errorHandler) {
      errorHandler(appwriteError);
    }

    throw appwriteError;
  }
};