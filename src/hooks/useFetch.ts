import { useEffect, useState } from "react";

export const useFetch = (url: string, wait = false) => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    hasError: null,
  });

  useEffect(() => {
    async () => {
      setState({
        ...state,
        isLoading: true,
      });
      if (wait) {
        await new Promise((r) => setTimeout(r, 2000));
      }

      const res = await fetch(url);
      const data = await res.json();
      setState({
        data,
        isLoading: false,
        hasError: null,
      });
    };
  }, [url, state, wait]);

  return {
    ...state,
  };
};
