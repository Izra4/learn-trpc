import { useState, useEffect } from "react";
import { TPaginationResponse } from "@/types/meta";
import { FilmSchedule } from "@prisma/client";
import { MOCK_SCHEDULE } from "../_dummies/shcedule-mock-data";

export const useFetchScheduleByStudioId = (
  studioId: string,
  filters: Record<string, any>,
  pagination: { page: number; per_page: number },
) => {
  const [data, setData] = useState<TPaginationResponse<FilmSchedule[]> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchedules = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredData = MOCK_SCHEDULE.data
          .filter((item) => item.studioId === studioId)
          .filter((item) =>
            item.showTime.toLowerCase().includes((filters.search || "").toLowerCase()),
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
        const result = await fetchSchedules();
        setData(result as TPaginationResponse<FilmSchedule[]>);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters.search, pagination.page, pagination.per_page]);

  return { data, isLoading };
};
