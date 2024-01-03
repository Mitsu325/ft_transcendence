import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';

export const Pagination = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): PaginationOptions => {
        const request = ctx.switchToHttp().getRequest();
        const { page = 1, limit = 10 } = request.query;
        return {
            page: Number(page),
            limit: Number(limit),
        };
    },
);
