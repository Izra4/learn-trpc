import { useActionMutation } from "@/libs/action-query";
import { updateScheduleByIdAction } from "@/server/schedule/actions/schedule.action";
import { CustomException } from "@/types/cutom-exception";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useRouter } from "next/navigation";

export const useUpdateScheduleMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useActionMutation(updateScheduleByIdAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      message.success("Schedule updated successfully!");
      router.push("/schedules");
    },
    onError: (error: CustomException) => {
      message.error(error.message);
    },
  });
};
