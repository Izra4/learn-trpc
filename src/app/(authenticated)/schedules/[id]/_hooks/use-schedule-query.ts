import { getScheduleByIdAction } from "@/server/schedule/actions/schedule.action";
import { useQuery } from "@tanstack/react-query";

export const useScheduleQuery = (id: string) => {
  return useQuery({
    queryKey: ["schedule", id],
    queryFn: () => getScheduleByIdAction(id),
  });
};
