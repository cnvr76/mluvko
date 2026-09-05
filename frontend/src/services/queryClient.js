import { QueryClient } from "@tanstack/react-query";

// A 401 that reaches here already went through apiClient's own refresh-and-retry
// interceptor and still failed — retrying it again from React Query would just
// repeat a refresh we know is dead. Every other error keeps the default retry.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        error?.response?.status !== 401 && failureCount < 3,
    },
  },
});
