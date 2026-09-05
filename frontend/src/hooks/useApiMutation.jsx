import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useApiMutation = (
  mutationFn,
  { invalidateKey, errorMessage, onSuccess, onError } = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      }
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const message =
        onError?.(error, variables, context) ??
        errorMessage ??
        "Akcia zlyhala.";
      toast.error(message);
    },
  });
};

export default useApiMutation;
