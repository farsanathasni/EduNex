import { getCoordinatorStatus } from "@/lib/coordinators"
import { useQuery } from "@tanstack/react-query"


export const useCoordinatorStatusQuery =()=>{
    return useQuery({
        queryKey:["coordinator","status"],
        queryFn:getCoordinatorStatus
    })
}