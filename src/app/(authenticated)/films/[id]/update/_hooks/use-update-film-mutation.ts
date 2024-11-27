import { useActionMutation } from "@/libs/action-query";
import { updateFilmAction } from "@/server/film/actions/film.action";
import { CustomException } from "@/types/cutom-exception";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useRouter } from "next/navigation";

export const useFilmUpdateMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useActionMutation(updateFilmAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["film"] });
      message.success("Film updated successfully");
      router.push("/films");
    },
    onError: (error: CustomException) => {
      message.error(error.message);
    },
  });
};
