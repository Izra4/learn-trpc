import { useState, useEffect } from "react";
import { TPaginationResponse } from "@/types/meta";
import { Facility } from "@prisma/client";
import { MOCK_FACILITIES } from "../_dummies/facility-mock-data";

export const useFetchFacilities = (
  filters: Record<string, any>,
  pagination: { page: number; per_page: number },
) => {
  const [data, setData] = useState<TPaginationResponse<Facility[]> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFacilities = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredData = MOCK_FACILITIES.data.filter((item) =>
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
        const result = await fetchFacilities();
        setData(result as TPaginationResponse<Facility[]>);
      } catch (error) {
        console.error("Error fetching facility:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters.search, pagination.page, pagination.per_page]);

  return { data, isLoading };
};
