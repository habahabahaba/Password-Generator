// Logic:
import generatePassword, {
  defaultPasswordOptions,
} from './logic/generatePassword';
// React:
import { useState, useEffect, useRef } from 'react';
// Components:
import PasswordBooleanInput from './Components/PasswordBooleanInput';
import PasswordAlert from './Components/PasswordAlert';
// Icons:
import copyIcon from './assets/copy-icon.svg';
// import { ReactComponent as CopyIcon } from './assets/copy-icon.svg';
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

// Component:
function App() {
  // State:
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>(
    defaultPasswordOptions,
  );
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<Messages>(null);
  const [error, setError] = useState<Errors>(initError);

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
    [passwordOptions],
  );

  // Autocorrecting:
  function autocorrectPasswordLength(): void {
    // Autocorrect the password length to the range of [8, 32]:
    setPasswordOptions((state) => ({
      ...state,
      passwordLength: Math.min(32, Math.max(8, state.passwordLength)),
    }));
  }

  function autocorrectCharacterTypes(): void {
    const { hasLowerCase, hasUpperCase, hasNumbers, hasSpecial } =
      passwordOptions;
    // If no character types are selected
    if (!hasLowerCase && !hasUpperCase && !hasNumbers && !hasSpecial) {
      // Autocorrect the password from having no character types to having lowercase characters:
      setPasswordOptions((state) => ({
        ...state,
        hasLowerCase: true,
      }));
    }
  }

  // Handlers:
  function setOption(
    optionName: passwordOptionsKeys,
    value: number | boolean,
  ): void {
    // resetFeedback();
    if (optionName === 'passwordLength') {
      setPasswordOptions((state) => ({ ...state, passwordLength: +value }));
    } else {
      setPasswordOptions((state) => ({ ...state, [optionName]: !!value }));
    }
  }

  // For autocorrectCharacterTypes (and to prevent two character types to be selected on one click during the autocorrecting):
  const characterTypesRef = useRef<HTMLInputElement | null>(null);
  let isClickInside = false; // to filter out the clicks outside the character types form
  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    isClickInside =
      (characterTypesRef.current?.contains(event.target as Node) &&
        characterTypesRef.current !== event.target) ??
      false;
  }

  // handleCharacterTypesBlur fires the autocorrectCharacterTypes if the focus travels outside the character types checkboxes or labels, while none of character types are selected:
  function handleCharacterTypesBlur(): void {
    const newFocusTarget = document.activeElement;
    if (
      !isClickInside &&
      characterTypesRef.current &&
      !characterTypesRef.current.contains(newFocusTarget)
    ) {
      autocorrectCharacterTypes();
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
    <div className="mb-1 w-fit">
      <div
        className={`my-1 box-border grid grid-cols-2 gap-x-24 gap-y-2 rounded-md border-2 py-1 pr-14 pl-2 ${
          error.charTypes
            ? 'border-red-600 dark:border-red-500'
            : 'border-transparent'
        }`}
        ref={characterTypesRef}
        onBlur={handleCharacterTypesBlur}
        onMouseDown={handleMouseDown}
      >
        <PasswordBooleanInput
          label="a-z"
          optionName="hasLowerCase"
          value={passwordOptions.hasLowerCase}
          handler={setOption}
        />
        <PasswordBooleanInput
          label="A-Z"
          optionName="hasUpperCase"
          value={passwordOptions.hasUpperCase}
          handler={setOption}
        />
        <PasswordBooleanInput
          label="0-9"
          optionName="hasNumbers"
          value={passwordOptions.hasNumbers}
          handler={setOption}
        />
        <PasswordBooleanInput
          label="!@#$%^"
          optionName="hasSpecial"
          value={passwordOptions.hasSpecial}
          handler={setOption}
        />
      </div>
      <div className="px-1">
        <PasswordBooleanInput
          label="Avoid ambiguous characters"
          optionName="nonAmbiguous"
          value={passwordOptions.nonAmbiguous}
          handler={setOption}
        />
      </div>
    </div>
  );

  return (
    <div className="flex w-fit flex-col gap-2">
      <div className="flex flex-col items-start gap-2 rounded-md bg-slate-200 p-2 dark:bg-zinc-800 dark:text-gray-100">
        <label htmlFor="passwordLength" className="flex flex-col gap-1">
          {error.passwordLength ? (
            <PasswordAlert isError text={error.passwordLength} />
          ) : (
            <span className="text-lg">Password length:</span>
          )}
          <div
            className={`flex place-items-stretch gap-3 rounded-md border-2 p-2 ${
              error.passwordLength ? 'border-red-600' : 'border-transparent'
            }`}
          >
            <input
              id="passwordLength"
              type="number"
              min={8}
              max={32}
              value={passwordOptions.passwordLength}
              onChange={(event) => {
                setOption('passwordLength', +event.target.value);
              }}
              onBlur={autocorrectPasswordLength}
              className="w-11 rounded border-0 bg-white pl-1 outline-0 dark:bg-gray-700 dark:accent-indigo-400 dark:focus:ring-2 dark:focus:ring-indigo-400"
            />
            <input
              type="range"
              min={8}
              max={32}
              value={passwordOptions.passwordLength}
              onChange={(event) => {
                setOption('passwordLength', +event.target.value);
              }}
              className="w-65 dark:text-gray-700 dark:accent-indigo-400"
            />
          </div>
        </label>

        <div className="mt-1 mb-2 flex w-full flex-col">
          {error.charTypes ? (
            <PasswordAlert isError text={error.charTypes} />
          ) : (
            <span className="text-lg"> Character types:</span>
          )}
          {checkboxes}
        </div>
        <div className="flex w-full gap-1">
          <button
            className="h-8 w-8 rounded bg-emerald-500 opacity-90 hover:opacity-100 active:opacity-90 disabled:opacity-40"
            onClick={handleGeneratePassword}
            disabled={!!error.passwordLength || !!error.charTypes}
          >
            <svg
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 112.62 120.72"
              className="m-auto w-5 fill-white"
            >
              <title>generate password</title>
              <path d="M11.64,100.12l-.4-.47-1.06,8.63a5.08,5.08,0,0,1-1.92,3.41A5.11,5.11,0,0,1,0,107L2.79,84.65v-.07a3.28,3.28,0,0,1,.08-.41h0A5.09,5.09,0,0,1,9,80.39q11.22,2.53,22.42,5.15a5,5,0,0,1,3.17,2.25,5.14,5.14,0,0,1,.64,3.84v0a5,5,0,0,1-2.25,3.16,5.08,5.08,0,0,1-3.83.65c-3.31-.75-6.62-1.52-9.92-2.28a40.71,40.71,0,0,0,2.84,3,50.09,50.09,0,0,0,26.23,13.49,48.67,48.67,0,0,0,14.71.34A47.35,47.35,0,0,0,77,106h0q2.52-1.19,4.83-2.54c1.56-.93,3.07-1.92,4.51-3a50.8,50.8,0,0,0,8.56-7.88,48.92,48.92,0,0,0,6.39-9.45l.56-1.1,10,2.69-.8,1.66a58.64,58.64,0,0,1-7.9,12.24,61.28,61.28,0,0,1-10.81,10.1c-1.68,1.23-3.46,2.4-5.32,3.5s-3.73,2.07-5.74,3a58,58,0,0,1-17,5,58.56,58.56,0,0,1-17.79-.39,60.21,60.21,0,0,1-31.58-16.26c-1.2-1.16-2.26-2.31-3.24-3.45ZM101,20.6l.4.47,1-8.63a5.11,5.11,0,1,1,10.14,1.26l-2.74,22.37,0,.07c0,.13,0,.27-.07.41h0a5.09,5.09,0,0,1-6.08,3.78c-7.47-1.69-15-3.4-22.42-5.15a5,5,0,0,1-3.16-2.25,5.1,5.1,0,0,1-.65-3.84v0a5,5,0,0,1,2.25-3.16,5.1,5.1,0,0,1,3.84-.65c3.31.75,6.61,1.52,9.92,2.28-.84-1-1.77-2-2.84-3.05a50.09,50.09,0,0,0-12.13-8.73A49.49,49.49,0,0,0,64.37,11a48.6,48.6,0,0,0-14.7-.34,47.26,47.26,0,0,0-14,4.1h0q-2.53,1.18-4.83,2.54c-1.57.93-3.07,1.92-4.52,3a50.34,50.34,0,0,0-8.55,7.88,48,48,0,0,0-6.39,9.45l-.57,1.1L.76,36l.8-1.66A58.9,58.9,0,0,1,9.46,22.1,61.63,61.63,0,0,1,20.27,12q2.54-1.85,5.32-3.5c1.81-1.06,3.73-2.07,5.74-3a58,58,0,0,1,17-5A58.56,58.56,0,0,1,66.16.89a59.77,59.77,0,0,1,17,5.74A60.4,60.4,0,0,1,97.75,17.15c1.19,1.16,2.26,2.31,3.24,3.45Z" />
            </svg>
          </button>
          <div className="mx-auto mt-1">
            <PasswordAlert
              text={error.clipboard ? error.clipboard : message}
              isError={!!error.clipboard}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-around gap-2 rounded-md bg-slate-200 p-2 dark:bg-zinc-800 dark:text-gray-100">
        <input
          value={password}
          onChange={(event) => {
            handlePasswordChange(event.target.value);
          }}
          className="min-w-82 rounded border-0 bg-white px-1 text-sm text-nowrap outline-0 dark:bg-gray-700 dark:accent-indigo-400 dark:focus:ring-2 dark:focus:ring-indigo-400"
        />
        <button
          className="h-8 w-8 rounded bg-emerald-500 opacity-90 hover:opacity-100 active:opacity-90 disabled:opacity-40"
          onClick={copyToClipboard}
          disabled={!password}
        >
          <svg
            version="1.1"
            id="Layer_1"
            viewBox="0 0 115.77 122.88"
            className="m-auto w-5 fill-white"
          >
            <g>
              <path d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z" />
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
