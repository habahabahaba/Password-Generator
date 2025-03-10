// 3rd party:
// Redux RTK:
// Store:
// React Router:
// React:
// Context:
// Hooks:
// Components:
// CSS:
// Types, interfaces and enumns:
import type { FC, InputHTMLAttributes } from "react";
type PasswordStyledInputProps = {
  tailwindClass?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const PasswordStyledInput: FC<PasswordStyledInputProps> = ({
  tailwindClass,
  ...rest
}) => {
  // JSX:
  return (
    <input
      className={`${tailwindClass} rounded border-0 bg-white outline-0 dark:bg-zinc-600 dark:accent-indigo-400 dark:selection:bg-indigo-500 dark:focus:ring-2 dark:focus:ring-indigo-400`}
      {...rest}
    />
  );
};

export default PasswordStyledInput;
