import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "../../../services/api.js";
import {
  collectMediaPaths,
  uploadPendingFiles,
} from "../../../utils/pendingMedia";
import { deleteServerFile } from "../../../utils/mediaPaths";
import useApiMutation from "../../useApiMutation";

const useGameEditor = (gameId, snapshotId) => {
  const [formData, setFormData] = useState(null);
  const initialFormDataRef = useRef(null);

  const gameQueryKey = ["game", gameId, snapshotId];
  const { data: loadedGame, isLoading } = useQuery({
    queryKey: gameQueryKey,
    queryFn: () =>
      snapshotId
        ? api.versions.info(gameId, snapshotId)
        : api.games.byId(gameId),
    enabled: Boolean(gameId),
  });

  useEffect(() => {
    if (!loadedGame) return;
    setFormData(loadedGame);
    initialFormDataRef.current = JSON.parse(JSON.stringify(loadedGame));
  }, [loadedGame]);

  const handleBaseChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveMutation = useApiMutation(
    async (currentFormData) => {
      // 1) nahrať všetky lokálne odložené súbory (PendingFile) a nahradiť ich
      //    serverovými cestami v hlbokej kópii formData
      const uploaded = await uploadPendingFiles(currentFormData);

      // 2) zistiť, ktoré pôvodné media cesty po novom ukladaní zmizli –
      //    tie treba po úspešnom PATCHi zmazať zo servera (best-effort)
      const initialPaths = collectMediaPaths(initialFormDataRef.current);
      const updatedPaths = collectMediaPaths(uploaded);
      const orphanPaths = [...initialPaths].filter((p) => !updatedPaths.has(p));

      // 3) uložiť hru s finálnymi cestami
      await api.versions.saveDraft(gameId, uploaded);

      return { uploaded, orphanPaths };
    },
    {
      invalidateKey: gameQueryKey,
      onSuccess: ({ uploaded, orphanPaths }) => {
        // 4) ako baseline pre ďalší diff si pamätáme uložený stav
        setFormData(uploaded);
        initialFormDataRef.current = JSON.parse(JSON.stringify(uploaded));

        // 5) až po úspešnom save zahodíme osirotené súbory
        for (const path of orphanPaths) {
          deleteServerFile(path);
        }

        toast.success("Hra bola úspešne uložená!");
      },
      onError: (e) => e?.response?.data?.detail || "Chyba pri ukladaní.",
    },
  );

  return {
    formData,
    loading: isLoading || !formData,
    saving: saveMutation.isPending,
    handleBaseChange,
    handleSave: () => saveMutation.mutate(formData),
  };
};

export default useGameEditor;
