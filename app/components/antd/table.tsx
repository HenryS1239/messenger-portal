import { IPagination } from "@/app/models/ui.models";

export const Footer = (data: readonly any[], pagination: IPagination) => {
    const from = pagination.pageSize && pagination.current !== undefined ? pagination.pageSize * (pagination.current - 1) : 0;
    const to = from + data.length;
    return (
        <span>
            Showing {from + 1} - {to} of {pagination.total}
        </span>
    );
};
