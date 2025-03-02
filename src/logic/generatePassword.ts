// Types, interfaces and enumns:
export interface PasswordOptions {
  passwordLength: number;
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasNumbers: boolean;
  hasSpecial: boolean;
  noAmbiguous: boolean;
}

const defaultPasswordOptions: PasswordOptions = {
  passwordLength: 8,
  hasLowerCase: true,
  hasUpperCase: true,
  hasNumbers: true,
  hasSpecial: true,
  noAmbiguous: true,
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
    noAmbiguous,
  } = options;

  // Character types:

  const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
  const UPPERCASE_CHARS = noAmbiguous
    ? 'ABCDEFGHIJKLMNPQRSTUVWXYZ'
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NUMBER_CHARS = noAmbiguous ? '123456789' : '0123456789';
  const SPECIAL_CHARS = noAmbiguous
    ? '!@#$%^&*()-_=+[{]}\\;:\'",<.>/?`~'
    : '!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?`~';

  // If no character types are provided:
  if (!(hasLowerCase || hasUpperCase || hasNumbers || hasSpecial)) return '';

  // Calculate number of characters of each type:
  let usedCharTypesNumber = 4;

  //   function typedKeys<T extends object>(obj: T): (keyof T)[] {
  //     return Object.keys(obj) as (keyof T)[];
  //   }
  const optionsKeys = Object.keys(options) as (keyof PasswordOptions)[]; // TS BS
  let charTypeLengths: number[] = optionsKeys
    .filter((key) => key !== 'passwordLength' && key !== 'noAmbiguous') // "passwordLength" is not a char type
    .map((key) => {
      if (options[key] === true) return 1;
      usedCharTypesNumber--;
      return 0;
    });

  const charTypeBorders = [0].concat(
    uniqueRandomsInRange(usedCharTypesNumber - 1, 1, passwordLength - 1).sort(
      (a, b) => a - b
    )
  );
  console.log('borders: ', charTypeBorders);
  let bordersIdx: number = 0;
  charTypeLengths = charTypeLengths.map((typeLength, i) => {
    if (!typeLength) return 0;
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
  charStrings.forEach((str, idx) => {
    for (let i = 0; i < charTypeLengths[idx]; i++) {
      passwordChars.push(str[randomInRange(0, str.length - 1)]);
    }
  });
  console.log('passwordChars: ', passwordChars);

  const passwordCharsIndicies: number[] = uniqueRandomsInRange(
    passwordLength,
    0,
    passwordLength - 1
  );

  console.log('passwordCharsIndicies: ', passwordCharsIndicies);

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
  const normalizedMax = max - min;

  if (quantity > normalizedMax + 1 || quantity <= 0) return [];

  const numbers = new Set<number>();

  let num: number;
  for (let i = 0; i < quantity; i++) {
    num = randomInRange(0, normalizedMax + 1);
    while (numbers.has(num % (normalizedMax + 1))) {
      num++;
    }
    numbers.add(num % (normalizedMax + 1));
  }

  return [...numbers].map((num) => num + min);
}
