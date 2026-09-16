import { useEffect, useState } from "react";
import { api } from "../../services/api";
import useManagedList from "./useManagedList";

const USERS_KEY = ["users", "all"];

const useUserManagement = () => {
  const [edits, setEdits] = useState({});

  const {
    items: users,
    isLoading,
    handleAction,
  } = useManagedList({ queryKey: USERS_KEY, queryFn: api.users.all });

  useEffect(() => {
    const initialEdits = {};
    users.forEach((user) => {
      initialEdits[user.id] = { username: user.username, role: user.role };
    });
    setEdits(initialEdits);
  }, [users]);

  const updateEdit = (userId, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }));
  };

  const isDirty = (user) => {
    const edit = edits[user.id];
    if (!edit) return false;
    return edit.username !== user.username || edit.role !== user.role;
  };

  return { users, isLoading, edits, updateEdit, isDirty, handleAction };
};

export default useUserManagement;
