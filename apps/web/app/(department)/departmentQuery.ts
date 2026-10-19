import { getDepartment } from "@/lib/department"
import { useQuery } from "@tanstack/react-query"


export const DepartmentKey=["departments"] as const

export const useDepartment=()=>{
    return useQuery({
        queryKey:DepartmentKey,
        queryFn:getDepartment,
        retry:1
    })
}