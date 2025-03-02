// Types, interfaces and enumns:
export interface PasswordOptions {
  passwordLength: number;
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasNumbers: boolean;
  hasSpecial: boolean;
  nonAmbiguous: boolean;
}

const defaultPasswordOptions: PasswordOptions = {
  passwordLength: 8,
  hasLowerCase: true,
  hasUpperCase: true,
  hasNumbers: true,
  hasSpecial: true,
  nonAmbiguous: true,
};

export default function generatePassword(
  options: PasswordOptions = defaultPasswordOptions
): string {
  console.log(JSON.stringify(options, null, 2));

  const {
    passwordLength,
    hasLowerCase,
    hasUpperCase,
    hasNumbers,
    hasSpecial,
    nonAmbiguous,
  } = options;

  // Characters by types:
  const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
  const UPPERCASE_CHARS = nonAmbiguous
    ? 'ABCDEFGHIJKLMNPQRSTUVWXYZ'
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // if nonAmbiguous option is selected, remove "O".
  const NUMBER_CHARS = nonAmbiguous ? '123456789' : '0123456789'; // if nonAmbiguous option is selected, remove "0" (zero).
  const SPECIAL_CHARS = nonAmbiguous
    ? '!@#$%^&*()-_=+[{]}\\;:\'",<.>/?`~'
    : '!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?`~'; // if nonAmbiguous option is selected, remove "|", so it won't be confused with "I".

  // If no character types are provided:
  if (!(hasLowerCase || hasUpperCase || hasNumbers || hasSpecial)) return '';

  // Calculate number of characters of each type:

  // Determine which character types are to be used in the password:
  let usedCharTypesNumber = 4;

  const optionsKeys = Object.keys(options) as (keyof PasswordOptions)[]; // TS BS
  let charTypeLengths: number[] = optionsKeys
    .filter((key) => key !== 'passwordLength' && key !== 'nonAmbiguous') // "passwordLength" and "nonAmbiguous" are not a char type
    .map((key) => {
      if (options[key] === true) return 1; // characters of this type should be in the password
      // decrease the number of used character types:
      usedCharTypesNumber--;
      return 0;
    });

  // In order to maintain high randomness, we generate a unique random number between 1 and passwordLength - 1 FOR EACH used character type BUT the first one, which is set to 0.

  const charTypeBorders = [0].concat(
    uniqueRandomsInRange(usedCharTypesNumber - 1, 1, passwordLength - 1)
      // We sort the resulted array of numbers (charTypeBorders) in the ascending order.
      .sort((a, b) => a - b)
  );
  console.log('borders: ', charTypeBorders);

  let bordersIdx: number = 0;
  charTypeLengths = charTypeLengths.map((typeLength) => {
    if (!typeLength) return 0; // if this character type is unused

    // The difference between the two adjacent numbers from charTypeBorders will become a quantity of characters of a respective type (typeLength).
    const charTypeLength =
      (charTypeBorders[bordersIdx + 1] ?? passwordLength) -
      charTypeBorders[bordersIdx++];

    return charTypeLength;
  });
  console.log('charTypeLengths: ', charTypeLengths);

  const charStrings = [
    LOWERCASE_CHARS,
    UPPERCASE_CHARS,
    NUMBER_CHARS,
    SPECIAL_CHARS,
  ];

  const passwordChars: string[] = [];

  charStrings.forEach((charString, idx) => {
    for (let i = 0; i < charTypeLengths[idx]; i++) {
      // Push a random character of a respective type into the passwordChars array:
      passwordChars.push(charString[randomInRange(0, charString.length - 1)]);
    }
  });
  console.log('passwordChars: ', passwordChars);

  // Randomise the sequence of characters in the password:
  const passwordCharsIndicies: number[] = uniqueRandomsInRange(
    passwordLength,
    0,
    passwordLength - 1
  );

  console.log('passwordCharsIndicies: ', passwordCharsIndicies);

  // Assemble the password:
  const password = passwordCharsIndicies
    .map((idx) => passwordChars[idx])
    .join('');

  return password;
}

function randomInRange(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function uniqueRandomsInRange(
  quantity: number,
  min: number,
  max: number
): number[] {
  const normalizedMax = max - min + 1;

  if (quantity > normalizedMax || quantity <= 0) return [];

  const numbers = new Set<number>();

  let num: number;
  for (let i = 0; i < quantity; i++) {
    num = randomInRange(0, normalizedMax);
    while (numbers.has(num % normalizedMax)) {
      num++;
    }
    numbers.add(num % normalizedMax);
  }

  return [...numbers].map((num) => num + min);
}
