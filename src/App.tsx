import generatePassword from './logic/generatePassword';
import { defaultPasswordOptions } from './logic/generatePassword';
// React:
import { useState, useEffect } from 'react';
// Components:
import PasswordBooleanInput from './Components/PasswordBooleanInput';
// Types, interfaces and enumns:
import type {
  PasswordOptions,
  passwordOptionsKeys,
} from './logic/generatePassword';
type Errors =
  | ''
  | 'The minimum available length is 8.'
  | 'The maximum available length is 32.'
  | 'At least one character type has to be selected.'
  | 'Failed to copy the password!';
type Messages = '' | 'The password was copied to the clipboard.';

function App() {
  // State:
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>(
    defaultPasswordOptions
  );
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<Messages>('');
  const [error, setError] = useState<Errors>('');

  // Validation:
  useEffect(
    function validate(): void {
      const {
        passwordLength,
        hasLowerCase,
        hasUpperCase,
        hasNumbers,
        hasSpecial,
      } = passwordOptions;
      if (passwordLength < 8) {
        setError(() => 'The minimum available length is 8.');
      } else if (passwordLength > 32) {
        setError(() => 'The maximum available length is 32.');
      } else if (!hasLowerCase && !hasUpperCase && !hasNumbers && !hasSpecial) {
        setError(() => 'At least one character type has to be selected.');
      }
    },
    [passwordOptions]
  );

  function resetFeedback(): void {
    setError(() => '');
    setMessage(() => '');
  }

  // Handlers:
  function setOption(
    optionName: passwordOptionsKeys,
    value: number | boolean
  ): void {
    resetFeedback();
    if (optionName === 'passwordLength') {
      // Coopt the password length to the range of [8, 32]:
      const newLength = Math.min(32, Math.max(8, +value));
      setPasswordOptions((state) => ({ ...state, passwordLength: newLength }));
    } else {
      setPasswordOptions((state) => ({ ...state, [optionName]: !!value }));
    }
    // validate();
  }

  function handlePasswordChange(value: string): void {
    resetFeedback();
    setPassword(() => value);
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setMessage(() => 'The password was copied to the clipboard.');
    } catch (err) {
      setError(() => 'Failed to copy the password!');
      console.error('Failed to copy: ', err);
    }
  };

  // JSX:
  const checkboxes = (
    <div className='px-1 my-2 '>
      <div className='grid grid-cols-2 gap-y-2 gap-x-6  mb-4 '>
        <PasswordBooleanInput
          label='a-z'
          optionName='hasLowerCase'
          value={passwordOptions.hasLowerCase}
          handler={setOption}
        />
        <PasswordBooleanInput
          label='A-Z'
          optionName='hasUpperCase'
          value={passwordOptions.hasUpperCase}
          handler={setOption}
        />
        <PasswordBooleanInput
          label='0-9'
          optionName='hasNumbers'
          value={passwordOptions.hasNumbers}
          handler={setOption}
        />
        <PasswordBooleanInput
          label='!@#$%^'
          optionName='hasSpecial'
          value={passwordOptions.hasSpecial}
          handler={setOption}
        />
      </div>
      <PasswordBooleanInput
        label='Avoid ambiguous characters'
        optionName='nonAmbiguous'
        value={passwordOptions.nonAmbiguous}
        handler={setOption}
      />
    </div>
  );

  const feedback = (
    <div className='h-5 mt-3 mb-1 w-full'>
      {error ? (
        <span className='bg-white p-1 border-1 border-black text-red-600'>
          {error}
        </span>
      ) : null}
      {message ? (
        <span className='bg-white p-1 border-1'>{message}</span>
      ) : null}
    </div>
  );

  return (
    <div className='flex flex-col gap-2 w-fit'>
      <div className='flex flex-col gap-2 items-start bg-gray-100 rounded-xl p-3 '>
        <label htmlFor='passwordLength' className='flex flex-col gap-1'>
          Password length:
          <div className='flex gap-3 place-items-stretch'>
            <input
              id='passwordLength'
              type='number'
              min={8}
              max={32}
              // maxLength={2}
              // readOnly={true}
              // onKeyDown={() => false}
              value={passwordOptions.passwordLength}
              onChange={(event) => {
                setOption('passwordLength', +event.target.value);
              }}
              className='w-11 border-2 rounded pl-1 bg-white'
            />
            <input
              type='range'
              min={8}
              max={32}
              value={passwordOptions.passwordLength}
              onChange={(event) => {
                setOption('passwordLength', +event.target.value);
              }}
              className='w-70'
            />
          </div>
        </label>

        <div className='my-2 w-full'>
          <span> Character types:</span>
          {checkboxes}
          {feedback}
        </div>

        <button
          className='border-2 border-gray-600 rounded px-1 bg-gray-200 disabled:text-gray-500 disabled:border-gray-400'
          onClick={() => {
            setPassword(() => generatePassword(passwordOptions));
          }}
          disabled={!!error}
        >
          Generate
        </button>
      </div>
      <div className='flex justify-around gap-3 bg-gray-100 rounded-xl p-2'>
        <input
          value={password}
          onChange={(event) => {
            handlePasswordChange(event.target.value);
          }}
          className='min-w-90 border-2 rounded px-1 bg-white'
        />
        <button
          className='border-2 border-gray-600 rounded px-1 bg-gray-200 disabled:text-gray-500 disabled:border-gray-400'
          onClick={copyToClipboard}
          disabled={!password}
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export default App;
