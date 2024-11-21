import { useState, useEffect } from "react";
import { TPaginationResponse } from "@/types/meta";
import { MOCK_GENRES } from "../_dummies/genre-mock-data";
import { Genre } from "@prisma/client";

export const useFetchGenres = (
  filters: Record<string, any>,
  pagination: { page: number; per_page: number },
) => {
  const [data, setData] = useState<TPaginationResponse<Genre[]> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGenres = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredData = MOCK_GENRES.data.filter((item) =>
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
        const result = await fetchGenres();
        setData(result as TPaginationResponse<Genre[]>);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters.search, pagination.page, pagination.per_page]);

  return { data, isLoading };
};
