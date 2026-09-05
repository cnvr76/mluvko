import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import useApiMutation from "../useApiMutation";

const DASHBOARD_KEY = ["admin", "dashboard"];

const useAdminDashboard = () => {
  const [statusFilter, setStatusFilter] = useState("pending");

  const { data: games = [], isLoading } = useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: api.admin.dashboard,
  });

  const actionMutation = useApiMutation(
    ({ actionFn, args }) => actionFn(...args),
    { invalidateKey: DASHBOARD_KEY },
  );

  const handleAction = (actionFn, ...args) =>
    actionMutation.mutate({ actionFn, args });

  return { games, isLoading, statusFilter, setStatusFilter, handleAction };
};

export default useAdminDashboard;
