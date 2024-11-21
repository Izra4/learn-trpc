import { TPaginationMeta, TPaginationResponse } from "@/types/meta";
import { PaginationFilter } from "admiral/table/datatable/hook";
import { TablePaginationConfig } from "antd";

// TODO: please review this function | compare with src/utils/datatable/pagination.ts
export const paginationTransform = (t?: TPaginationMeta): TablePaginationConfig => {
  return {
    current: t?.page,
    pageSize: t?.perPage,
    total: t?.total,
  };
};

// TODO: please review this function
export const makeSource = <T>(data?: TPaginationResponse<T>) => {
  return {
    data: data?.data,
    meta: paginationTransform(data?.meta),
  };
};

export const makePagination = (pagination: PaginationFilter) => {
  return {
    page: pagination.page,
    perPage: pagination.per_page,
  };
};
