import { useState, useEffect } from "react";
import { TPaginationResponse } from "@/types/meta";
import { Studio } from "@prisma/client";
import { MOCK_STUDIOS } from "../_dummies/studio-mock-data";

export const useFetchStudios = (
  filters: Record<string, any>,
  pagination: { page: number; per_page: number },
) => {
  const [data, setData] = useState<TPaginationResponse<Studio[]> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudios = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredData = MOCK_STUDIOS.data.filter((item) =>
          item.name.toLowerCase().includes((filters.search || "").toLowerCase()),
        );

        const paginatedData = {
          data: filteredData.slice(
            (pagination.page - 1) * pagination.per_page,
            pagination.page * pagination.per_page,
          ),
          meta: {
            page: pagination.page,
            perPage: pagination.per_page,
            total: filteredData.length,
            totalPage: Math.ceil(filteredData.length / pagination.per_page),
          },
        };

        resolve(paginatedData);
      }, 1000);
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchStudios();
        setData(result as TPaginationResponse<Studio[]>);
      } catch (error) {
        console.error("Error fetching studios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters.search, pagination.page, pagination.per_page]);

  return { data, isLoading };
};
