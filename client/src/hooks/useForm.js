import { useState } from 'react';

/**
 * Tiny form helper.
 *   const { values, field } = useForm({ name: '' });
 *   <input {...field('name')} />
 */
export function useForm(initial) {
  const [values, setValues] = useState(initial);
  const field = (name) => ({
    name,
    value: values[name] ?? '',
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
  });
  return { values, setValues, field };
}
