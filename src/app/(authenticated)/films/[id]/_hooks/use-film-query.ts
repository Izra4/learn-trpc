import { getFilmAction } from "@/server/film/actions/film.action";
import { useQuery } from "@tanstack/react-query";

export const useFilmQuery = (id: string) => {
  return useQuery({
    queryKey: ["film", id],
    queryFn: () => getFilmAction(id),
  });
};
