import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
}

export function useApi<T>(
  url: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete' = 'get'
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (data?: unknown) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await api[method]<T>(url, data);
        setState({ data: response.data, loading: false, error: null });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        setState({ data: null, loading: false, error: axiosError });
        throw axiosError;
      }
    },
    [url, method]
  );

  return { ...state, execute };
}

export function useGet<T>(url: string) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await api.get<T>(url);
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      setState({ data: null, loading: false, error: axiosError });
      throw axiosError;
    }
  }, [url]);

  // Initial fetch
  const [fetched, setFetched] = useState(false);
  if (!fetched && !state.loading && !state.data && !state.error) {
    setFetched(true);
    refetch();
  }

  return { ...state, refetch };
}
