import { Pagination } from 'interfaces/reqBody/pagination.interface';

export const buildPaginationUrl = (
  baseURL: string,
  pagination?: Pagination,
): string => {
  let url = baseURL;

  if (pagination) {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    });

    url += `?${params.toString()}`;
  }

  return url;
};
