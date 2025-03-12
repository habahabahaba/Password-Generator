// Types, interfaces and enumns:
export interface PasswordOptions {
  passwordLength: number;
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasNumbers: boolean;
  hasSpecial: boolean;
  nonAmbiguous: boolean;
}
export type passwordOptionsKeys =
  | "passwordLength"
  | "hasLowerCase"
  | "hasUpperCase"
  | "hasNumbers"
  | "hasSpecial"
  | "nonAmbiguous";

export const defaultPasswordOptions: PasswordOptions = {
  passwordLength: 12,
  hasLowerCase: true,
  hasUpperCase: true,
  hasNumbers: true,
  hasSpecial: true,
  nonAmbiguous: true,
};

export default function generatePassword(
  options: PasswordOptions = defaultPasswordOptions,
): string {
  console.log(JSON.stringify(options, null, 2));

  const { passwordLength, nonAmbiguous } = options;

  // Characters by types:
  const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
  const UPPERCASE_CHARS = nonAmbiguous
    ? "ABCDEFGHIJKLMNPQRSTUVWXYZ"
    : "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // if nonAmbiguous option is selected, remove "O".
  const NUMBER_CHARS = nonAmbiguous ? "123456789" : "0123456789"; // if nonAmbiguous option is selected, remove "0" (zero).
  const SPECIAL_CHARS = nonAmbiguous
    ? "!@#$%^&*()-_=+[{]}\\;:'\",<.>/?`~"
    : "!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?`~"; // if nonAmbiguous option is selected, remove "|", so it won't be confused with "I".

  // passwordChars will hold all the characters for the password, grouped by a character type. (The sequence of characters will be randomized later.)
  const passwordChars: string[] = new Array<string>(passwordLength);

  // Determine, which character types are to be used in the password according to the options argument:

  // We filter the options argument for character types, while maintaining their order and calculating the total number of used types:
  let usedCharTypesNumber = 4;
  const usedCharTypes: boolean[] = Object.entries(options)
    .filter(([key]) => key !== "passwordLength" && key !== "nonAmbiguous") // "passwordLength" and "nonAmbiguous" are not character types.
    .map(([, value]) => {
      if (!value) {
        // if the character type is set to false in the options argument
        // Decrease the total number of character types:
        usedCharTypesNumber--;
      }
      return value;
    });
  console.log("usedCharTypes: ", usedCharTypes);

  // SAFE-GUARDS:
  // If no character types are provided:
  if (!usedCharTypesNumber) return "";
  // If password does not have enough length to include characters of all selected types:
  if (passwordLength < usedCharTypesNumber) return "";

  // We generate a unique random starting indicies in the passwordChars array for groups of characters of each used type. The FIRST starting index is set to 0.
  const charTypeStarts = [0].concat(
    uniqueRandomsInRange(usedCharTypesNumber - 1, 1, passwordLength - 1)
      // We sort the resulted array of random numbers (charTypeStarts) in the ascending order to prevent character groups from overlapping:
      .sort((a, b) => a - b),
  );
  console.log("charTypeStarts: ", charTypeStarts);

  // Populate he passwordChars array:

  // The array of all characters grouped by type and in order, in which they appear in the options argument:
  const charStrings = [
    LOWERCASE_CHARS,
    UPPERCASE_CHARS,
    NUMBER_CHARS,
    SPECIAL_CHARS,
  ];

  // startsIdx will be used for traversing through the charTypeStarts array, while populating the passwordChars array:
  let startsIdx: number = 0;

  // Traverse through the usedCharTypes array and populate the passwordChars array with the characters of used types according to starting indicies (from charTypeStarts) for groups of each respective type:
  for (let i = 0; i < usedCharTypes.length; i++) {
    if (!usedCharTypes[i]) continue; // if character type is unused
    const charString = charStrings[i]; // the string, that consists of all characters of a respective type

    // The starting index for the characters of a CURRENT used type inside the passwordChars array:
    const groupStart = charTypeStarts[startsIdx];
    // The starting index for the characters of a NEXT used type inside the passwordChars array:
    const nextGroupStart =
      charTypeStarts[startsIdx + 1] ?? passwordChars.length;

    // Go through the segment of the passwordChars array, that is allocated for the characters of respective type:
    for (let j = groupStart; j < nextGroupStart; j++) {
      // pick a random character from the charString:
      const randomChar = charString[randomInRange(0, charString.length - 1)];
      // Place the randomChar in the passwordChars at the appropriate index:
      passwordChars[j] = randomChar;
    }

    startsIdx++; // go to the starting index of a next group;
  }

  console.log("passwordChars: ", passwordChars);

  // Randomise the sequence of characters in the password:
  const passwordCharsSequence: number[] = uniqueRandomsInRange(
    passwordLength,
    0,
    passwordLength - 1,
  );

  console.log("passwordCharsSequence: ", passwordCharsSequence);

  // Assemble the password:
  const password = passwordCharsSequence
    .map((idx) => passwordChars[idx])
    .join("");

  return password;
}

// Returns a random integer from a provided range.
function randomInRange(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min));
}

// Returns an array of unique random integers from a provided range.
function uniqueRandomsInRange(
  quantity: number, // how many numbers should the function return
  min: number,
  max: number,
): number[] {
  // Normalizing the min-max range, so that the minimum possible number will always be zero:
  const normalizedMax = max - min + 1;

  // SAFE-GUARD:
  // If provided range is not big enough for a provided quantity of unique numbers:
  if (quantity > normalizedMax || quantity <= 0) return [];

  const numbers = new Set<number>();

  let num: number;
  for (let i = 0; i < quantity; i++) {
    num = randomInRange(0, normalizedMax);

    while (numbers.has(num)) {
      // // If the number has been generated before, pick the next number:
      // num++;
      // If the number has been generated before, generate a new number:
      num = randomInRange(0, normalizedMax);
    }
    numbers.add(num);
  }

  // Denormalizing generated numbers:
  return [...numbers].map((num) => num + min);
}
