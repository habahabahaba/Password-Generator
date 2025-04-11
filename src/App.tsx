// Components:
import PasswordGeneratorPanel from "./Components/PasswordGeneratorPanel";
// Types, interfaces and enumns:
import type { PasswordOptions } from "./logic/generatePassword";

function App() {
  function testSubscription(
    password: string,
    passwordOptions: PasswordOptions,
  ) {
    console.log(
      `[testSubscription] selected password options: ${JSON.stringify(passwordOptions, null, 2)}`,
    );

    console.log(`[testSubscription] new password: ${password}`);
  }

  // JSX:
  return (
    <>
      <PasswordGeneratorPanel onNewPassword={testSubscription} />
    </>
  );
}

export default App;
