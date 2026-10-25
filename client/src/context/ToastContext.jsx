import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();

  // Usage: const toast = useToast(); toast('Saved!'); toast('Oops', true);
  const show = useCallback((message, isError = false) => {
    clearTimeout(timer.current);
    setToast({ message, isError });
    timer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div className={'toast' + (toast.isError ? ' error' : '')} role="status">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
