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
import type { FC } from "react";
interface PasswordAlertProps {
  text: string | null;
  isError?: boolean;
}

const PasswordAlert: FC<PasswordAlertProps> = ({ text, isError = false }) => {
  // JSX:
  return (
    <div className='mb-4 h-3'>
      {text ? (
        <span
          className={`text-md rounded-md border-1 bg-slate-50 px-1.5 py-0.5 hover:cursor-default ${
            isError
              ? "border-black text-red-600 dark:border-red-500 dark:text-red-500"
              : "text-indigo-800 dark:border-indigo-300 dark:text-indigo-300"
          } dark:bg-zinc-900`}
        >
          {text}
        </span>
      ) : null}
    </div>
  );
};

export default PasswordAlert;
