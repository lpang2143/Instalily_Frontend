import { useState, useEffect } from 'react';

export default function useLocalStorage(key, default_value) {
    const [value, setValue] = useState(() => {
        const stored_value = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
        return stored_value === null ? default_value : JSON.parse(stored_value)
    });

    useEffect(() => {
        const listener = (e) => {
          if (typeof window !== 'undefined' && e.storageArea === localStorage && e.key === key) {
            setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
          }
        };
        window.addEventListener('storage', listener);
    
        return () => {
          window.removeEventListener('storage', listener);
        };
    }, [key, default_value]);
    
    const setValueInLocalStorage = (newValue) => {
        setValue((current_value) => {
            const result = typeof newValue === 'function' ? newValue(current_value) : newValue;
            if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(result));
            return result;
        });
    };
    
    return [value, setValueInLocalStorage];
}