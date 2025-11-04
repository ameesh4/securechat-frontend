const BigInt = window.BigInt;

// Type definitions
export interface RSAPublicKey {
  n: bigint;
  e: bigint;
}

export interface RSAPrivateKey {
  n: bigint;
  d: bigint;
}

export interface RSAKeyPair {
  n: bigint;
  e: bigint;
  d: bigint;
}

export interface AESKeyResult {
  key: CryptoKey;
}

export interface AESEncryptResult {
  encrypted: Uint8Array;
  iv: Uint8Array;
}

export interface AESDecryptResult {
  decrypted: string;
}

// Miller-Rabin primality test for BigInt
function MillerRabinTest(n: bigint, k: number): boolean {
  // Handle simple cases
  if (n <= BigInt(1)) return false;
  if (n === BigInt(2) || n === BigInt(3)) return true;
  if (n % BigInt(2) === BigInt(0)) return false;

  const N: bigint = n - BigInt(1);
  // Find s and d such that n-1 = 2^s * d, where d is odd
  let s: bigint = BigInt(0);
  let d: bigint = N;

  while (d % BigInt(2) === BigInt(0)) {
    d = d / BigInt(2);
    s = s + BigInt(1);
  }

  // Witness loop - try k different random witnesses
  for (let i: number = 0; i < k; i++) {
    const a: bigint = randomBigInt(BigInt(2), n - BigInt(2));
    let x: bigint = modPowBigInt(a, d, n);

    if (x === BigInt(1) || x === N) continue; // Probably prime, try next witness

    let isProbablyPrime: boolean = false;

    // Repeatedly square x, checking for n-1 at each step
    for (let j: bigint = BigInt(0); j < s - BigInt(1); j = j + BigInt(1)) {
      x = (x * x) % n;
      if (x === N) {
        isProbablyPrime = true;
        break; // Found a value that equals n-1, continue to next witness
      }
      if (x === BigInt(1)) return false; // Definitely composite
    }

    if (!isProbablyPrime) return false; // Failed this round, definitely composite
  }

  return true; // Passed all rounds, probably prime
}
// Modular exponentiation for BigInt
function modPowBigInt(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus === BigInt(1)) return BigInt(0);
  let result: bigint = BigInt(1);
  base = base % modulus;

  while (exponent > BigInt(0)) {
    if (exponent % BigInt(2) === BigInt(1)) {
      result = (result * base) % modulus;
    }
    exponent = exponent / BigInt(2);
    base = (base * base) % modulus;
  }

  return result;
}
// Generate a random BigInt in range [min, max]
function randomBigInt(min: bigint, max: bigint): bigint {
  // Calculate range size
  const range: bigint = max - min + BigInt(1);

  // Get number of bytes needed
  const bytes: number = (range.toString(2).length + 7) >> 3;

  // Create random bytes
  const randomBytes: Uint8Array = new Uint8Array(bytes);
  crypto.getRandomValues(randomBytes);

  // Convert to BigInt and map to desired range
  let randomValue: bigint = BigInt(0);
  for (let i: number = 0; i < randomBytes.length; i++) {
    randomValue = (randomValue << BigInt(8)) | BigInt(randomBytes[i]);
  }

  // Ensure result is within range
  return min + (randomValue % range);
}

function generateSecureRandomBigInt(bitLength: number): bigint {
  // 1. Calculate the number of bytes needed.
  const byteLength: number = Math.ceil(bitLength / 8);

  // 2. Create a buffer to hold the random bytes.
  const randomBytes: Uint8Array = new Uint8Array(byteLength);

  // 3. Fill the buffer with cryptographically secure random values.
  crypto.getRandomValues(randomBytes);

  // 4. Convert the bytes to a BigInt.
  // We do this by converting the bytes to a hex string first.
  let hex: string = "";
  for (let i: number = 0; i < randomBytes.length; i++) {
    // Convert byte to a 2-digit hex string and pad with '0' if needed.
    hex += randomBytes[i].toString(16).padStart(2, "0");
  }

  // Prepend '0x' to the hex string to create the BigInt.
  return BigInt("0x" + hex);
}

function getPrime(): bigint {
  let primeCandidate: bigint = BigInt(0);
  do {
    primeCandidate = generateSecureRandomBigInt(1024);
  } while (!MillerRabinTest(primeCandidate, 40));
  return primeCandidate;
}

function extendedGCD(a: bigint, b: bigint): [bigint, bigint, bigint] {
  if (a === BigInt(0)) return [b, BigInt(0), BigInt(1)];
  const [gcd, x1, y1]: [bigint, bigint, bigint] = extendedGCD(b % a, a);
  const x: bigint = y1 - (b / a) * x1;
  const y: bigint = x1;
  return [gcd, x, y];
}

// Function to calculate the least common multiple (LCM) of two BigInts
function lcm(a: bigint, b: bigint): bigint {
  return (a * b) / extendedGCD(a, b)[0];
}

export function RSA(): RSAKeyPair {
  let p: bigint = getPrime();
  let q: bigint = getPrime();
  while (p === q) {
    q = getPrime();
  }
  let n: bigint = p * q;
  let phi: bigint = lcm(p - BigInt(1), q - BigInt(1));
  const e: bigint = BigInt(65537); // Common choice for e, must be coprime with phi
  const [gcd, , d]: [bigint, bigint, bigint] = extendedGCD(e, phi);
  const d_positive: bigint = ((d % phi) + phi) % phi; // Ensure d is positive
  return {
    n,
    e,
    d: d_positive,
  };
}

export async function GetAESKey(): Promise<AESKeyResult> {
  const key: CryptoKey = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  return { key };
}

export async function AESEncrypt(
  plainText: string,
  key: CryptoKey
): Promise<AESEncryptResult> {
  const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV

  const encoder: TextEncoder = new TextEncoder();
  const data: Uint8Array = encoder.encode(plainText);
  const encrypted: ArrayBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv as BufferSource,
    },
    key,
    data as BufferSource
  );
  return {
    encrypted: new Uint8Array(encrypted),
    iv,
  };
}

export async function AESDecrypt(
  encrypted: Uint8Array,
  key: CryptoKey,
  iv: Uint8Array
): Promise<AESDecryptResult> {
  const decrypted: ArrayBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv as BufferSource,
    },
    key,
    encrypted as BufferSource
  );
  const decoder: TextDecoder = new TextDecoder();
  return {
    decrypted: decoder.decode(decrypted),
  };
}

export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  //   const base64chars =
  //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  //   let result = "";
  //   let i = 0;

  //   while (i < uint8Array.length) {
  //     const byte1 = uint8Array[i++];
  //     const byte2 = i < uint8Array.length ? uint8Array[i++] : 0;
  //     const byte3 = i < uint8Array.length ? uint8Array[i++] : 0;

  //     const bitmap = (byte1 << 16) | (byte2 << 8) | byte3;

  //     result += base64chars.charAt((bitmap >> 18) & 63);
  //     result += base64chars.charAt((bitmap >> 12) & 63);
  //     result +=
  //       i - 2 < uint8Array.length ? base64chars.charAt((bitmap >> 6) & 63) : "=";
  //     result += i - 1 < uint8Array.length ? base64chars.charAt(bitmap & 63) : "=";
  //   }

  //   return result;
  return btoa(String.fromCharCode(...uint8Array));
}

export function base64ToUint8Array(base64String: string): Uint8Array {
  //   const base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  //   const charMap = new Map();
  //   for (let i = 0; i < base64chars.length; i++) {
  //     charMap.set(base64chars[i], i);
  //   }

  //   // Remove padding
  //   const cleanBase64 = base64String.replace(/=/g, '');
  //   const bytes = [];

  //   for (let i = 0; i < cleanBase64.length; i += 4) {
  //     const char1 = charMap.get(cleanBase64[i]) || 0;
  //     const char2 = charMap.get(cleanBase64[i + 1]) || 0;
  //     const char3 = charMap.get(cleanBase64[i + 2]) || 0;
  //     const char4 = charMap.get(cleanBase64[i + 3]) || 0;

  //     const bitmap = (char1 << 18) | (char2 << 12) | (char3 << 6) | char4;

  //     bytes.push((bitmap >> 16) & 255);
  //     if (i + 2 < cleanBase64.length) bytes.push((bitmap >> 8) & 255);
  //     if (i + 3 < cleanBase64.length) bytes.push(bitmap & 255);
  //   }

  //   return new Uint8Array(bytes);
  return new Uint8Array(
    atob(base64String)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
}

export function RSAEncrypt(message: string, publicKey: RSAPublicKey): bigint {
  const { n, e }: RSAPublicKey = publicKey;

  // Convert message to BigInt
  const encoder: TextEncoder = new TextEncoder();
  const messageBytes: Uint8Array = encoder.encode(message);

  // Convert bytes to BigInt
  let messageBigInt: bigint = BigInt(0);
  for (let i: number = 0; i < messageBytes.length; i++) {
    messageBigInt = (messageBigInt << BigInt(8)) | BigInt(messageBytes[i]);
  }

  // Ensure message is smaller than n
  if (messageBigInt >= n) {
    throw new Error("Message too large for RSA key size");
  }

  // Encrypt: c = m^e mod n
  const encrypted: bigint = modPowBigInt(messageBigInt, e, n);
  return encrypted;
}

export function RSADecrypt(
  ciphertext: bigint,
  privateKey: RSAPrivateKey
): string {
  const { n, d }: RSAPrivateKey = privateKey;

  // Decrypt: m = c^d mod n
  const decrypted: bigint = modPowBigInt(ciphertext, d, n);

  // Convert BigInt back to string
  const bytes: number[] = [];
  let temp: bigint = decrypted;

  while (temp > BigInt(0)) {
    bytes.unshift(Number(temp & BigInt(0xff)));
    temp = temp >> BigInt(8);
  }

  // Filter out leading null bytes and control characters
  const cleanBytes: number[] = bytes.filter(
    (byte: number, index: number): boolean => {
      // Remove leading bytes that are 0 or control characters (1-31)
      if (index === 0 && byte <= 31) {
        return false;
      }
      return true;
    }
  );

  const decoder: TextDecoder = new TextDecoder();
  return decoder.decode(new Uint8Array(cleanBytes));
}

export async function ExportAESKey(key: CryptoKey): Promise<string> {
  const exported: ArrayBuffer = await crypto.subtle.exportKey("raw", key);
  return uint8ArrayToBase64(new Uint8Array(exported));
}

export async function ImportAESKey(keyBase64: string): Promise<CryptoKey> {
  // Convert Base64 string back to Uint8Array
  const keyBytes: Uint8Array = base64ToUint8Array(keyBase64);

  const key: CryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes as BufferSource,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
}

export function uint8ArrayToBigInt(uint8Array: Uint8Array): bigint {
  let result: bigint = BigInt(0);
  for (let i: number = 0; i < uint8Array.length; i++) {
    result = (result << BigInt(8)) | BigInt(uint8Array[i]);
  }
  return result;
}

export function bigIntToUint8Array(bigInt: bigint): Uint8Array {
  const bytes: number[] = [];
  let temp: bigint = bigInt;

  if (temp === BigInt(0)) {
    return new Uint8Array([0]);
  }

  while (temp > BigInt(0)) {
    bytes.unshift(Number(temp & BigInt(0xff)));
    temp = temp >> BigInt(8);
  }

  return new Uint8Array(bytes);
}

export function bigintToBase64(bigintValue: bigint): string {
  // Convert BigInt to byte array
  const byteArray: number[] = [];
  let temp: bigint = bigintValue;
  while (temp > BigInt(0)) {
    byteArray.unshift(Number(temp & BigInt(0xff))); // Get the last byte
    temp = temp >> BigInt(8); // Shift right by 8 bits
  }
  // Convert byte array to Uint8Array
  const uint8Array: Uint8Array = new Uint8Array(byteArray);
  return uint8ArrayToBase64(uint8Array);
}

export function base64ToBigint(base64String: string): bigint {
  // Convert Base64 string to Uint8Array
  const uint8Array: Uint8Array = base64ToUint8Array(base64String);
  // Convert Uint8Array to BigInt (big-endian)
  let bigintValue: bigint = BigInt(0);
  for (const byte of uint8Array) {
    bigintValue = (bigintValue << BigInt(8)) | BigInt(byte);
  }
  return bigintValue;
}
