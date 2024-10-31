import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
  useInfiniteQuery<FetchResponse<Game>, Error>({
    queryKey: ["games", gameQuery],
    //queryFn是需要引用apiClient.getAll方法，不是调用它的结果；使用箭头函数，函数里返回对apiClient.getAll的引用，并给apiClient.getAll传入筛选参数；

    // pageParam 初始值设为1，这样获取了第一页数据；
    queryFn: ({ pageParam = 1 }) => {
      return apiClient.getAll({
        params: {
          genres: gameQuery.genreId,
          parent_platforms: gameQuery.platformId,
          ordering: gameQuery.sortOrder,
          search: gameQuery.searchText,
          //将pageParam赋给请求参数page
          page: pageParam,
        },
      });
    },
    // react-query会调用这个函数，计算下一页页码；
    getNextPageParam: (lastPage, allPages) => {
      // console.log("lastPage", lastPage,"allPages", allPages);
      // allPages包含我们当前检索到的每个页面的数据；所以直接用它的长度加1；
      return lastPage.next ? allPages.length + 1 : undefined;
    },
    staleTime: 24 * 60 * 60 * 1000, //缓存时间：24h
  });

export default useGames;
