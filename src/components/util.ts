import { useEffect } from 'react';
export const useDidMount = (func: () => void) =>
  useEffect(() => {
    func();
  }, []);
