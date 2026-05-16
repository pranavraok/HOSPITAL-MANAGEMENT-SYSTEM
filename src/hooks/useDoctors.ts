import type { Doctor } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchDoctors() {
  const response = await fetch("/api/doctors");
  if (!response.ok) throw new Error("Failed to fetch doctors");
  return (await response.json()) as Doctor[];
}

export function useDoctors() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });

  return {
    doctors: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: ["doctors"] }),
  } as const;
}

export default useDoctors;
