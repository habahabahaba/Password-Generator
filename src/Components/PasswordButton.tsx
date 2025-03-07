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
import { type FC } from 'react';
interface PasswordButtonProps {
  onClick: () => void;
  isDisabled: boolean;
  children: React.ReactNode;
}

const PasswordButton: FC<PasswordButtonProps> = ({
  onClick,
  isDisabled,
  children,
}) => {
  // JSX:
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="h-8 w-8 rounded bg-emerald-500 opacity-90 hover:opacity-100 active:opacity-80 disabled:opacity-40"
    >
      {children}
    </button>
  );
};

export default PasswordButton;
