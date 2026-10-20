import {
  getDepartments,
  getHodDashboard,
  getHodStudents,
} from "@/lib/hod";
import { useQuery } from "@tanstack/react-query";

export const useHodDashboard = () => {
  return useQuery({
    queryKey: ["hod", "dashboard"],
    queryFn: getHodDashboard,
    retry: false,
  });
};

export const useHodDepartments = (enabled = true) => {
  return useQuery({
    queryKey: ["hod", "departments"],
    queryFn: getDepartments,
    enabled,
    retry: false,
  });
};

export const useHodStudents = (
  departmentId?: number,
  semester?: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "hod",
      "students",
      departmentId ?? "all",
      semester ?? "all",
    ],
    queryFn: () => getHodStudents(departmentId, semester),
    enabled,
    retry: false,
  });
};