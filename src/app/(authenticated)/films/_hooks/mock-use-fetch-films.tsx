import { useState, useEffect } from "react";
import { TPaginationResponse } from "@/types/meta";
import { Film } from "@prisma/client";
import { MOCK_FILMS } from "../_dummies/mock-film-data";

export const useFetchFilms = (
  filters: Record<string, any>,
  pagination: { page: number; per_page: number },
) => {
  const [data, setData] = useState<TPaginationResponse<Film[]> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFilms = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredData = MOCK_FILMS.data.filter((item) =>
          item.title.toLowerCase().includes((filters.search || "").toLowerCase()),
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
        const result = await fetchFilms();
        setData(result as TPaginationResponse<Film[]>);
      } catch (error) {
        console.error("Error fetching films:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters.search, pagination.page, pagination.per_page]);

  return { data, isLoading };
};
