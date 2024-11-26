import { useState } from "react";
import { message } from "antd";
import { TPaginationResponse } from "@/types/meta";
import { FilmSchedule } from "@prisma/client";
import { MOCK_SCHEDULE } from "../_dummies/shcedule-mock-data";

export const useDeleteSchedule = (
  setData: React.Dispatch<React.SetStateAction<TPaginationResponse<FilmSchedule[]> | null>>,
) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteSchedule = async (id: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          MOCK_SCHEDULE.data = MOCK_SCHEDULE.data.filter((schedule) => schedule.id !== id);
          resolve({ success: true });
        } else {
          reject(new Error("Simulated error: Unable to delete schedule."));
        }
      }, 500);
    });
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteSchedule(id);
      message.success("Schedule deleted successfully");

      // Update the local state by filtering out the deleted item
      setData((prevData) => {
        if (!prevData) return null;
        const updatedData = prevData.data.filter((schedule) => schedule.id !== id);
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
      message.error(error.message || "An error occurred while deleting the schedule");
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
};
