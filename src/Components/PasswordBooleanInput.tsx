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
}

const PasswordBooleanInput: FC<PasswordBooleanInputProps> = ({
  label,
  optionName,
  value,
  handler,
}) => {
  // JSX:
  return (
    <>
      <label htmlFor={optionName} className='flex gap-2 items-center'>
        <input
          id={optionName}
          type='checkbox'
          checked={value}
          onChange={(event) => {
            handler(optionName, event.target.checked);
          }}
          className='w-4 h-4'
        />
        {label}
      </label>
    </>
  );
};

export default PasswordBooleanInput;
