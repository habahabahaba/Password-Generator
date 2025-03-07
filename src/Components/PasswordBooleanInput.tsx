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
import type { passwordOptionsKeys } from '../logic/generatePassword';

interface PasswordBooleanInputProps {
  label: string;
  optionName: passwordOptionsKeys;
  value: boolean;
  handler: (optionName: passwordOptionsKeys, value: boolean) => void;
  disabled?: boolean;
  highlighted?: boolean;
}

const PasswordBooleanInput: FC<PasswordBooleanInputProps> = ({
  label,
  optionName,
  value,
  handler,
  disabled = false,
  highlighted = false,
}) => {
  // JSX:
  return (
    <label htmlFor={optionName} className="flex items-center gap-2">
      <input
        id={optionName}
        type="checkbox"
        checked={value}
        onChange={(event) => {
          handler(optionName, event.target.checked);
        }}
        disabled={disabled}
        className={`h-4 w-4 ${highlighted ? 'border-2 border-red-600' : ''} dark:accent-indigo-400`}
      />
      {label}
    </label>
  );
};

export default PasswordBooleanInput;
