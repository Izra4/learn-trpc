import { useState } from "react";
import { message } from "antd";
import { TPaginationResponse } from "@/types/meta";
import { Facility } from "@prisma/client";
import { MOCK_FACILITIES } from "../_dummies/facility-mock-data";

export const useDeleteFacility = (
  setData: React.Dispatch<React.SetStateAction<TPaginationResponse<Facility[]> | null>>,
) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteFacility = async (id: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          MOCK_FACILITIES.data = MOCK_FACILITIES.data.filter((facility) => facility.id !== id);
          resolve({ success: true });
        } else {
          reject(new Error("Simulated error: Unable to delete facility."));
        }
      }, 500);
    });
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteFacility(id);
      message.success("Facility deleted successfully");

      // Update the local state by filtering out the deleted item
      setData((prevData) => {
        if (!prevData) return null;
        const updatedData = prevData.data.filter((facility) => facility.id !== id);
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
      message.error(error.message || "An error occurred while deleting the facility");
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
};
