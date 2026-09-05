import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import useApiMutation from "../useApiMutation";

const ALL_REQUESTS_KEY = ["role-requests", "all"];

const useRoleRequests = () => {
  const [statusFilter, setStatusFilter] = useState("pending");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ALL_REQUESTS_KEY,
    queryFn: api.roleRequests.all,
  });

  const actionMutation = useApiMutation(
    ({ actionFn, args }) => actionFn(...args),
    { invalidateKey: ALL_REQUESTS_KEY },
  );

  const handleAction = (actionFn, ...args) =>
    actionMutation.mutate({ actionFn, args });

  return { requests, isLoading, statusFilter, setStatusFilter, handleAction };
};

export default useRoleRequests;
