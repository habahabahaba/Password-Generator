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
import type { passwordOptionsKeys } from "../logic/generatePassword";

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
    <label
      htmlFor={optionName}
      className='flex items-center gap-2 hover:cursor-pointer'
    >
      <input
        id={optionName}
        type='checkbox'
        checked={value}
        onChange={(event) => {
          handler(optionName, event.target.checked);
        }}
        disabled={disabled}
        className={`h-4 w-4 hover:cursor-pointer ${highlighted ? "border-2 border-red-600" : ""} dark:border-2 dark:border-zinc-500 dark:bg-zinc-600 dark:accent-indigo-500 dark:ring-indigo-500 dark:not-checked:appearance-none dark:not-checked:rounded-xs dark:hover:accent-indigo-300`}
      />
      {label}
    </label>
  );
};

export default PasswordBooleanInput;
