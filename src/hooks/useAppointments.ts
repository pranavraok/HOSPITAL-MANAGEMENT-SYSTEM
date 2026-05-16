import type { AppointmentRecord } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchAppointments() {
  const response = await fetch("/api/appointments");
  if (!response.ok) throw new Error("Failed to fetch appointments");
  return (await response.json()) as AppointmentRecord[];
}

export function useAppointments() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  return {
    appointments: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  } as const;
}

export default useAppointments;
