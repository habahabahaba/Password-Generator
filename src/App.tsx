import generatePassword from './logic/generatePassword';
import { defaultPasswordOptions } from './logic/generatePassword';
// React:
import { useState, useEffect, useRef } from 'react';
// Components:
import PasswordBooleanInput from './Components/PasswordBooleanInput';
import PasswordAlert from './Components/PasswordAlert';
// Icons:
import copyIcon from './assets/copy-icon.svg';
import generateIcon from './assets/circle-arrow-icon.svg';
// Types, interfaces and enumns:
import type {
  PasswordOptions,
  passwordOptionsKeys,
} from './logic/generatePassword';
type Errors = {
  passwordLength:
    | null
    | 'The minimum password length is 8'
    | 'The maximum password length is 32';
  charTypes: null | 'At least one character type has to be selected';
  clipboard: null | 'Failed to copy the password!';
};
type Messages = null | 'The password was copied to the clipboard';

const initError: Errors = {
  passwordLength: null,
  charTypes: null,
  clipboard: null,
};

function App() {
  // State:
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>(
    defaultPasswordOptions
  );
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<Messages>(null);
  const [error, setError] = useState<Errors>(initError);

  const numInputRef = useRef<HTMLInputElement | null>(null);

  // Validation:
  useEffect(
    function validate(): () => void {
      const {
        passwordLength,
        hasLowerCase,
        hasUpperCase,
        hasNumbers,
        hasSpecial,
      } = passwordOptions;
      if (passwordLength < 8) {
        setError((state) => ({
          ...state,
          passwordLength: 'The minimum password length is 8',
        }));
      } else if (passwordLength > 32) {
        setError((state) => ({
          ...state,
          passwordLength: 'The maximum password length is 32',
        }));
      }
      if (!hasLowerCase && !hasUpperCase && !hasNumbers && !hasSpecial) {
        setError((state) => ({
          ...state,
          charTypes: 'At least one character type has to be selected',
        }));
      }

      return () => {
        setError(() => initError);
      };
    },
    [passwordOptions]
  );

  // Handlers:
  function setOption(
    optionName: passwordOptionsKeys,
    value: number | boolean
  ): void {
    // resetFeedback();
    if (optionName === 'passwordLength') {
      setPasswordOptions((state) => ({ ...state, passwordLength: +value }));
    } else {
      setPasswordOptions((state) => ({ ...state, [optionName]: !!value }));
    }
    // validate();
  }

  function cooptPasswordLength(): void {
    // Coopt the password length to the range of [8, 32]:
    setPasswordOptions((state) => ({
      ...state,
      passwordLength: Math.min(32, Math.max(8, state.passwordLength)),
    }));
  }

  function cooptCharacterTypes(): void {
    const { hasLowerCase, hasUpperCase, hasNumbers, hasSpecial } =
      passwordOptions;
    if (!hasLowerCase && !hasUpperCase && !hasNumbers && !hasSpecial) {
      setPasswordOptions((state) => ({
        ...state,
        hasLowerCase: true,
      }));
    }
  }

  function handleGeneratePassword(): void {
    setMessage(() => null);
    setError((state) => ({ ...state, clipboard: null }));
    setPassword(() => generatePassword(passwordOptions));
  }

  function handlePasswordChange(value: string): void {
    setMessage(() => null);
    setError((state) => ({ ...state, clipboard: null }));
    setPassword(() => value);
  }
  async function copyToClipboard() {
    try {
      // // Simulating a copy error
      // navigator.clipboard.writeText = async () => {
      //   throw new Error('Clipboard access denied');
      // };

      await navigator.clipboard.writeText(password);
      setMessage(() => 'The password was copied to the clipboard');
    } catch (err) {
      setError((state) => ({
        ...state,
        clipboard: 'Failed to copy the password!',
      }));
      console.error('Failed to copy: ', err);
    }
  }

  // JSX:
  const checkboxes = (
    <div className='w-fit mb-1'>
      <div
        className={`grid grid-cols-2 gap-y-2 gap-x-24  mb-1 py-1 px-2 pr-14 border-2 rounded-md ${
          error.charTypes ? ' border-red-600' : 'border-transparent'
        }`}
        // onBlur={cooptCharacterTypes}
      >
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
      <div className='px-1'>
        <PasswordBooleanInput
          label='Avoid ambiguous characters'
          optionName='nonAmbiguous'
          value={passwordOptions.nonAmbiguous}
          handler={setOption}
        />
      </div>
    </div>
  );

  return (
    <div className='flex flex-col gap-2 w-fit'>
      <div className='flex flex-col gap-2 items-start bg-gray-100 rounded-xl p-3 '>
        <label htmlFor='passwordLength' className='flex flex-col gap-1'>
          Password length:
          <div
            className={`flex gap-3 place-items-stretch   py-1 px-2 border-2 rounded-md ${
              error.passwordLength ? ' border-red-600' : 'border-transparent'
            }`}
          >
            <input
              id='passwordLength'
              type='number'
              min={8}
              max={32}
              ref={numInputRef}
              value={passwordOptions.passwordLength}
              onChange={(event) => {
                setOption('passwordLength', +event.target.value);
              }}
              onBlur={cooptPasswordLength}
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
              className='w-65'
            />
          </div>
        </label>
        <PasswordAlert isError text={error.passwordLength} />
        <div className='mt-1 mb-2 w-full'>
          <span> Character types:</span>
          {checkboxes}
          <PasswordAlert isError text={error.charTypes} />
        </div>
        <div className='flex  gap-3 '>
          <button
            className='border-2 border-gray-600 rounded px-1 bg-gray-200 opacity-80 hover:opacity-100 disabled:opacity-50  active:bg-gray-300'
            onClick={handleGeneratePassword}
            disabled={!!error.passwordLength || !!error.charTypes}
          >
            <img
              src={generateIcon}
              alt='generate password'
              className='w-5 py-1'
            />
          </button>
          <div className='mt-0.5'>
            <PasswordAlert
              text={error.clipboard ? error.clipboard : message}
              isError={!!error.clipboard}
            />
          </div>
        </div>
      </div>
      <div className='flex justify-around gap-2 bg-gray-100 rounded-xl p-2'>
        <input
          value={password}
          onChange={(event) => {
            handlePasswordChange(event.target.value);
          }}
          className='min-w-90 border-2 rounded px-1 bg-white'
        />
        <button
          className='border-2 border-gray-600 rounded px-1 bg-gray-200 opacity-80 hover:opacity-100 disabled:opacity-50 active:bg-gray-300'
          onClick={copyToClipboard}
          disabled={!password}
        >
          <img src={copyIcon} alt='copy password' className='w-5 py-1' />
        </button>
      </div>
    </div>
  );
}

export default App;
