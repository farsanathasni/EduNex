import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./current-user";

export const CurrentUserKey = ["current-user"];

export const useCurrentUser = () => {
  return useQuery({
    queryKey: CurrentUserKey,
    queryFn: getCurrentUser,
    retry: false,
  });
};