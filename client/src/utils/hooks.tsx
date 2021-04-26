import { useState } from "react";

export const useForm = (callback: any, initialState: any) => {
  const [values, setValues] = useState(initialState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    callback();
  };

  return [onChange, onSubmit, values];
};
