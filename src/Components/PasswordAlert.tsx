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
import type { FC } from 'react';
interface PasswordAlertProps {
  text: string | null;
  isError?: boolean;
}

const PasswordAlert: FC<PasswordAlertProps> = ({ text, isError = false }) => {
  // JSX:
  return (
    <div className="mb-4 h-3">
      {text ? (
        <span
          className={`text-md border-1 bg-white px-1 py-0.5 hover:cursor-default ${
            isError
              ? 'border-black text-red-600 dark:border-red-500 dark:text-red-500'
              : 'text-blue-800 dark:border-blue-300 dark:text-blue-400'
          } dark:bg-gray-900`}
        >
          {text}
        </span>
      ) : null}
    </div>
  );
};

export default PasswordAlert;
