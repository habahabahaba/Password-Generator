import generatePassword from './logic/generatePassword';

function App() {
  return (
    <>
      <span>{generatePassword()}</span>
    </>
  );
}

export default App;
