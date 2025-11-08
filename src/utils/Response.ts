export type Response<T> = {
    status: boolean;
    data: T;
    message: string;
    error?: string;
}