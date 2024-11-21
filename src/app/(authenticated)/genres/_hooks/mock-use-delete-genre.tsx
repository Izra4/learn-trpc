import { useState } from "react";
import { message } from "antd";
import { TPaginationResponse } from "@/types/meta";
import { MOCK_GENRES } from "../_dummies/genre-mock-data";
import { Genre } from "@prisma/client";

export const useDeleteGenre = (
  setData: React.Dispatch<React.SetStateAction<TPaginationResponse<Genre[]> | null>>,
) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteGenre = async (id: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          MOCK_GENRES.data = MOCK_GENRES.data.filter((genre) => genre.id !== id);
          resolve({ success: true });
        } else {
          reject(new Error("Simulated error: Unable to delete genre."));
        }
      }, 500);
    });
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteGenre(id);
      message.success("Genre deleted successfully");

      // Update the local state by filtering out the deleted item
      setData((prevData) => {
        if (!prevData) return null;
        const updatedData = prevData.data.filter((genre) => genre.id !== id);
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
      message.error(error.message || "An error occurred while deleting the genre");
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
};
