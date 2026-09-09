import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import useApiMutation from "../useApiMutation";

const MY_REQUEST_KEY = ["role-requests", "mine"];

const useRoleRequestPanel = () => {
  const { data: request, isLoading } = useQuery({
    queryKey: MY_REQUEST_KEY,
    queryFn: api.roleRequests.mine,
  });

  const applyMutation = useApiMutation(api.roleRequests.create, {
    invalidateKey: MY_REQUEST_KEY,
    errorMessage: "Žiadosť sa nepodarilo odoslať.",
  });

  return {
    request,
    isLoading,
    submitting: applyMutation.isPending,
    handleApply: () => applyMutation.mutate(),
  };
};

export default useRoleRequestPanel;
