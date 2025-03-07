// Logic:
import generatePassword, {
  defaultPasswordOptions,
} from "./logic/generatePassword";
// React:
import { useState, useEffect, useRef } from "react";
// Components:
import PasswordBooleanInput from "./Components/PasswordBooleanInput";
import PasswordAlert from "./Components/PasswordAlert";
import GeneratePasswordButton from "./Components/GeneratePasswordButton";
import CopyPasswordButton from "./Components/CopyPasswordButton";
import PasswordStyledInput from "./Components/PasswordStyledInput";

// Types, interfaces and enumns:
import type {
  PasswordOptions,
  passwordOptionsKeys,
} from "./logic/generatePassword";
type Errors = {
  passwordLength:
    | null
    | "The minimum password length is 8"
    | "The maximum password length is 32";
  charTypes: null | "At least one character type has to be selected";
  clipboard: null | "Failed to copy the password!";
};
type Messages = null | "The password was copied to the clipboard";

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
  const [password, setPassword] = useState<string>("");
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
          passwordLength: "The minimum password length is 8",
        }));
      } else if (passwordLength > 32) {
        setError((state) => ({
          ...state,
          passwordLength: "The maximum password length is 32",
        }));
      }
      if (!hasLowerCase && !hasUpperCase && !hasNumbers && !hasSpecial) {
        setError((state) => ({
          ...state,
          charTypes: "At least one character type has to be selected",
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
    if (optionName === "passwordLength") {
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
      false; // filer-out checkboxes and labels, but not their parent element
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
  async function handleCopyToClipboard() {
    try {
      // // Simulating a copy error
      // navigator.clipboard.writeText = async () => {
      //   throw new Error('Clipboard access denied');
      // };

      await navigator.clipboard.writeText(password);
      setMessage(() => "The password was copied to the clipboard");
    } catch (err) {
      setError((state) => ({
        ...state,
        clipboard: "Failed to copy the password!",
      }));
      console.error("Failed to copy: ", err);
    }
  }

  // JSX:
  const checkboxes = (
    <div className="mb-1 w-fit">
      <div
        className={`my-1 box-border grid grid-cols-2 gap-x-24 gap-y-2 rounded-md border-2 py-1 pr-14 pl-2 ${
          error.charTypes
            ? "border-red-600 dark:border-red-500"
            : "border-transparent"
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
    <div className="flex w-fit flex-col gap-2 dark:text-gray-100 dark:selection:bg-indigo-400">
      <div className="flex flex-col items-start gap-2 rounded-md bg-slate-200 p-2 dark:bg-zinc-800">
        <label htmlFor="passwordLength" className="flex flex-col gap-1">
          {error.passwordLength ? (
            <PasswordAlert isError text={error.passwordLength} />
          ) : (
            <span className="text-lg">Password length:</span>
          )}
          <div
            className={`flex place-items-stretch gap-3 rounded-md border-2 p-2 ${
              error.passwordLength ? "border-red-600" : "border-transparent"
            }`}
          >
            <PasswordStyledInput
              id="passwordLength"
              type="number"
              min={8}
              max={32}
              value={passwordOptions.passwordLength}
              onChange={(event) => {
                setOption("passwordLength", +event.target.value);
              }}
              onBlur={autocorrectPasswordLength}
              tailwindClass="w-11 pl-1"
            />
            <input
              type="range"
              min={8}
              max={32}
              value={passwordOptions.passwordLength}
              onChange={(event) => {
                setOption("passwordLength", +event.target.value);
              }}
              className="w-65 dark:accent-indigo-400"
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
          <GeneratePasswordButton
            onClick={handleGeneratePassword}
            isDisabled={!!error.passwordLength || !!error.charTypes}
          />
          <div className="mx-auto mt-1">
            <PasswordAlert
              text={error.clipboard ? error.clipboard : message}
              isError={!!error.clipboard}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-around gap-2 rounded-md bg-slate-200 p-2 dark:bg-zinc-800 dark:text-gray-50">
        <PasswordStyledInput
          value={password}
          onChange={(event) => {
            handlePasswordChange(event.target.value);
          }}
          tailwindClass="min-w-82 px-1 text-sm text-nowrap"
        />
        <CopyPasswordButton
          onClick={handleCopyToClipboard}
          isDisabled={!password}
        />
      </div>
    </div>
  );
}

export default App;
