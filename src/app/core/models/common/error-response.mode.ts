export interface ErrorResponse {
    StatusCode: number,
    Message: string,
    ErrorCode: number,
    Errors?: Record<string, string[]>,
    Timestamp: string,
}