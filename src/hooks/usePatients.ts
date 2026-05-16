import type { Patient } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchPatients() {
  const response = await fetch("/api/patients");
  if (!response.ok) throw new Error("Failed to fetch patients");
  return (await response.json()) as Patient[];
}

export function usePatients() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  return {
    patients: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  } as const;
}
