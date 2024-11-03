export interface IMessage {
    type?: "info" | "error" | "warning";
    message: string;
}

export interface IPagination {
    total?: number | undefined;
    pageSize: number | undefined;
    current: number | undefined;
}
