import { useQuery } from "@tanstack/react-query";
import { GameQuery } from "../App";
import APIClient, { FetchResponse } from "../services/api-client";
import { Platform } from "./usePlatforms";

export interface Game {
  id: number;
  name: string;
  background_image: string;
  parent_platforms: { platform: Platform }[];
  metacritic: number;
  rating_top: number;
}
//实例化APIClient类，传入endpoint参数'/genres';
const apiClient = new APIClient<Game>("/games");
const useGames = (gameQuery: GameQuery) =>
  useQuery<FetchResponse<Game>, Error>({
    queryKey: ["games", gameQuery],
    //queryFn是需要引用apiClient.getAll方法，不是调用它的结果；使用箭头函数，函数里返回对apiClient.getAll的引用，并给apiClient.getAll传入筛选参数；
    queryFn: () => {
      return apiClient.getAll({
        params: {
          genres: gameQuery.genre?.id,
          parent_platforms: gameQuery.platform?.id,
          ordering: gameQuery.sortOrder,
          search: gameQuery.searchText,
        },
      });
    },
  });

export default useGames;
