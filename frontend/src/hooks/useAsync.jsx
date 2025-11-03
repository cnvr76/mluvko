import React, { useCallback, useEffect, useState } from "react";

const useAsync = (asyncFunc, immediate = true) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(() => {
    setIsLoading(true);
    setData(null);
    setError(null);

    return asyncFunc()
      .then((response) => {
        setData(response);
        return response;
      })
      .catch((caught) => {
        setError(caught);
        throw error;
      })
      .finally(() => setIsLoading(false));
  }, [asyncFunc]);

  if (immediate) {
    useEffect(() => {
      execute();
    }, [execute]);
  }

  return { isLoading, data, error, execute };
};

export default useAsync;
