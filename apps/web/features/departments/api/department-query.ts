import { getDepartment } from "@/features/departments/api/department"
import { useQuery } from "@tanstack/react-query"


export const DepartmentKey=["departments"] as const

export const useDepartment=(enabled = true)=>{
    return useQuery({
        queryKey:DepartmentKey,
        queryFn:getDepartment,
        enabled,
        retry:1
    })
}