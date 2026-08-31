// Wires the access token onto every apiClient request and, on a 401,
// refreshes it once and retries. Concurrent 401s while a refresh is already
// in flight just await the same refreshPromise instead of each starting
// their own refresh call — no manual queue/flag bookkeeping needed, and
// nothing can "hang forever": every awaiter settles when that one promise
// settles.
export const createAuthInterceptors = ({
  apiClient,
  getAccessToken,
  refreshAccessToken,
  onAuthFailure,
}) => {
  let refreshPromise = null;

  const getRefreshedToken = () => {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken()
        .catch((error) => {
          onAuthFailure();
          throw error;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }
    return refreshPromise;
  };

  const requestInterceptor = apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const responseInterceptor = apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      const token = await getRefreshedToken();
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    },
  );

  return {
    eject: () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    },
  };
};
