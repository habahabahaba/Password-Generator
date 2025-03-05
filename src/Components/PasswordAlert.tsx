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
    <div className='h-3  mb-3 '>
      {text ? (
        <span
          className={`bg-white px-1 py-0.5 border-1 ${
            isError ? 'border-black text-red-600' : ''
          }`}
        >
          {text}
        </span>
      ) : null}
    </div>
  );
};

export default PasswordAlert;
