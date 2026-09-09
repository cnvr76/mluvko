import { useState } from "react";
import { api } from "../../services/api";
import useApiMutation from "../useApiMutation";

const usePersonalDetails = (data) => {
  const [savedName, setSavedName] = useState(data.username || "");
  const [name, setName] = useState(data.username || "");
  const [status, setStatus] = useState(null);

  const updateProfileMutation = useApiMutation(
    (username) => api.users.updateMe({ username }),
    {
      invalidateKey: ["profile", "me"],
      errorMessage: "Nepodarilo sa uložiť meno.",
      onSuccess: (updated) => {
        const newName = updated?.username ?? name.trim();
        setSavedName(newName);
        setName(newName);
        localStorage.setItem("username", newName);
        setStatus({ type: "success", text: "Meno bolo uložené." });
      },
      onError: () => {
        setStatus({ type: "error", text: "Nepodarilo sa uložiť meno." });
      },
    },
  );

  const trimmedName = name.trim();
  const isDirty = trimmedName.length > 0 && trimmedName !== savedName;

  const handleSave = () => {
    if (!isDirty) return;
    setStatus(null);
    updateProfileMutation.mutate(trimmedName);
  };

  return {
    name,
    setName,
    status,
    setStatus,
    isDirty,
    saving: updateProfileMutation.isPending,
    handleSave,
  };
};

export default usePersonalDetails;
