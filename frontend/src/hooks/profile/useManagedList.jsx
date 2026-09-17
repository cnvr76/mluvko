import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useApiMutation from "../useApiMutation";

const useManagedList = ({ queryKey, queryFn, initialFilter = "pending" }) => {
  const [statusFilter, setStatusFilter] = useState(initialFilter);

  const { data: items = [], isLoading } = useQuery({ queryKey, queryFn });

  const actionMutation = useApiMutation(
    ({ actionFn, args }) => actionFn(...args),
    { invalidateKey: queryKey },
  );

  const handleAction = (actionFn, ...args) =>
    actionMutation.mutate({ actionFn, args });

  return { items, isLoading, statusFilter, setStatusFilter, handleAction };
};

export default useManagedList;
