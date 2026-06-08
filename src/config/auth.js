export const ALLOWED_EMAILS = [
  "estebanc@procsolution.com",
  "melissaa@procsolution.com",
];

export function isAllowedEmail(email) {
  return ALLOWED_EMAILS.includes(email?.trim().toLowerCase());
}
