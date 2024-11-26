import { useActionMutation } from "@/libs/action-query";
import { updateStudioAction } from "@/server/studio/actions/studio.action";
import { CustomException } from "@/types/cutom-exception";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useRouter } from "next/navigation";

export const useUpdateStudioMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useActionMutation(updateStudioAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio"] });
      message.success("Studio updated successfully!");
      router.push("/studios");
    },
    onError: (error: CustomException) => {
      message.error(error.message);
    },
  });
};
