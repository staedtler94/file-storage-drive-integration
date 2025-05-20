export type OperationsResponse<T> = {
    code: number;
    message: string;
    data: T;
};