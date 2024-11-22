import { useState } from "react";
import { message } from "antd";
import { TPaginationResponse } from "@/types/meta";
import { Studio } from "@prisma/client";
import { MOCK_STUDIOS } from "../_dummies/studio-mock-data";

export const useDeleteStudio = (
  setData: React.Dispatch<React.SetStateAction<TPaginationResponse<Studio[]> | null>>,
) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteStudio = async (id: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          MOCK_STUDIOS.data = MOCK_STUDIOS.data.filter((studio) => studio.id !== id);
          resolve({ success: true });
        } else {
          reject(new Error("Simulated error: Unable to delete studio."));
        }
      }, 500);
    });
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteStudio(id);
      message.success("Studio deleted successfully");

      // Update the local state by filtering out the deleted item
      setData((prevData) => {
        if (!prevData) return null;
        const updatedData = prevData.data.filter((studio) => studio.id !== id);
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
      message.error(error.message || "An error occurred while deleting the studio");
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
};
