import { useState } from "react";
import { message } from "antd";
import { Film } from "@prisma/client";
import { TPaginationResponse } from "@/types/meta";
import { MOCK_FILMS } from "../_dummies/mock-film-data";

export const useDeleteFilm = (
  setData: React.Dispatch<React.SetStateAction<TPaginationResponse<Film[]> | null>>,
) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteFilm = async (id: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          MOCK_FILMS.data = MOCK_FILMS.data.filter((film) => film.id !== id);
          resolve({ success: true });
        } else {
          reject(new Error("Simulated error: Unable to delete film."));
        }
      }, 500);
    });
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteFilm(id);
      message.success("Film deleted successfully");

      // Update the local state by filtering out the deleted item
      setData((prevData) => {
        if (!prevData) return null;
        const updatedData = prevData.data.filter((film) => film.id !== id);
        return {
          ...prevData,
          data: updatedData,
          meta: {
            ...prevData.meta,
            total: prevData.meta.total - 1, // Update total count
          },
        };
      });
    } catch (error: any) {
      message.error(error.message || "An error occurred while deleting the film");
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
};
