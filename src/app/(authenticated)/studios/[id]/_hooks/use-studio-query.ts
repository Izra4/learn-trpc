import { getStudioAction } from "@/server/studio/actions/studio.action";
import { useQuery } from "@tanstack/react-query";

export const useStudioQuery = (id: string) => {
  return useQuery({
    queryKey: ["studio", id],
    queryFn: () => getStudioAction(id),
  });
};
