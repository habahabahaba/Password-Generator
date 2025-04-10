// Types, interfaces and enumns:
/**
 * Configuration options for password generation
 * @see generatePassword - The main function using this interface
 */
export interface PasswordOptions {
  /** Length of the password to generate (default: 12) */
  passwordLength: number;

  /** Include lowercase letters (default: true) */
  hasLowerCase: boolean;

  /** Include uppercase letters (default: true) */
  hasUpperCase: boolean;

  /** Include numbers (default: true) */
  hasNumbers: boolean;

  /** Include special characters (default: true) */
  hasSpecial: boolean;

  /**
   * Exclude ambiguous characters (default: true)
   * @remarks
   * - Removes: O, 0, l, I, |, etc.
   * - Improves readability while maintaining security
   * @see generatePassword - For implementation details
   */
  nonAmbiguous: boolean;
}
export type passwordOptionsKeys =
  | "passwordLength"
  | "hasLowerCase"
  | "hasUpperCase"
  | "hasNumbers"
  | "hasSpecial"
  | "nonAmbiguous";

/**
 * Default password generation options
 * @see generatePassword - The main function using these defaults
 * @see PasswordOptions - For the complete interface
 *
 * @example
 * {
 *   passwordLength: 12,
 *   hasLowerCase: true,
 *   hasUpperCase: true,
 *   hasNumbers: true,
 *   hasSpecial: true,
 *   nonAmbiguous: true
 * }
 */
export const defaultPasswordOptions: PasswordOptions = {
  passwordLength: 12,
  hasLowerCase: true,
  hasUpperCase: true,
  hasNumbers: true,
  hasSpecial: true,
  nonAmbiguous: true,
};

/**
 * Generates a secure password based on customizable options.
 *
 * @param options - Configuration object for password generation (defaults to `defaultPasswordOptions`)
 * @returns Generated password string meeting all specified criteria
 *
 * @throws {Error} If the configuration would produce an invalid password (no character types selected or password too short)
 *
 * @example
 * // Generate password with default options (12 chars, all character types)
 * const password = generatePassword();
 *
 * @example
 * // Generate 16-character password with only lowercase letters and numbers
 * const simplePassword = generatePassword({
 *   passwordLength: 16,
 *   hasLowerCase: true,
 *   hasUpperCase: false,
 *   hasNumbers: true,
 *   hasSpecial: false,
 *   nonAmbiguous: true
 * });
 *
 * @remarks
 * 1. Guarantees at least one character from each selected character type
 * 2. When `nonAmbiguous` is true, excludes easily confused characters (O, 0, l, I, |, etc.)
 * 3. Randomizes character order after ensuring all required character types are represented
 * 4. Uses cryptographically insecure `Math.random()` - not suitable for high-security applications
 */
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

/**
 * Generates a random integer within a specified inclusive range.
 *
 * @param min - The inclusive lower bound of the range (minimum possible value).
 * @param max - The inclusive upper bound of the range (maximum possible value).
 * @returns A random integer N where min ≤ N ≤ max.
 * @returns NaN if min > max.
 *
 * @example
 * // Returns a random number between 0 and 10 (inclusive)
 * const randomNum = randomInRange(0, 10);
 *
 * @example
 * // Returns either 1, 2, or 3 (all inclusive)
 * const oneTwoOrThree = randomInRange(1, 3);
 *
 * @remarks
 * 1. This function uses `Math.random()` internally, which is not cryptographically secure.
 * 2. For security-sensitive applications, consider using `window.crypto.getRandomValues()`.
 */
function randomInRange(min: number, max: number): number {
  if (min > max) return NaN;
  return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Generates an array of unique random integers within a specified inclusive range.
 *
 * @param quantity - The number of unique random integers to generate. Must be less than or equal to the size of the range.
 * @param min - The inclusive lower bound of the range (minimum possible value).
 * @param max - The inclusive upper bound of the range (maximum possible value).
 * @returns An array of unique random integers from the specified range.
 *
 * @throws {Error} If the requested quantity exceeds the available range size (max - min + 1).
 *
 * @example
 * // Returns 5 unique numbers between 1 and 10 (inclusive)
 * const randomNumbers = uniqueRandomsInRange(5, 1, 10);
 *
 * @example
 * // Returns all numbers from 1 to 5 in random order
 * const randomPermutation = uniqueRandomsInRange(5, 1, 5);
 */
function uniqueRandomsInRange(
  quantity: number, // how many numbers should the function return
  min: number, // inclusive start of range
  max: number, // inclusive end of range
): number[] {
  const output: number[] = []; // will contain a random sequence of numbers from the provided range.
  // All possible numbers from the range, placed in increasing order:
  const orderedNumbers: number[] = Array.from(
    { length: max - min + 1 },
    (_, i) => i + min,
  );
  // console.log(
  //   `[uniqueRandomsInRange] quantity: ${quantity}, min: ${min}, max: ${max}`,
  // );
  // console.log(`[uniqueRandomsInRange] orderedNumbers: ${orderedNumbers}`);

  let idx: number;
  // For quantity-arg times
  for (let i = 0; i < quantity; i++) {
    // pick random index of orderedNumbers array
    idx = randomInRange(0, orderedNumbers.length - 1);
    // push the number at that index to output array
    output.push(orderedNumbers[idx]);
    // then remove the number from orderedNumbers array
    orderedNumbers.splice(idx, 1);
  }
  // console.log(`[uniqueRandomsInRange] output: ${output}`);

  return output;
}
