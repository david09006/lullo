/**
 * Server-side input validation + sanitization, shared by the newsletter and
 * contact endpoints. React escapes output on render, so this focuses on
 * accepting only well-formed, length-bounded input and stripping control chars.
 */

// Pragmatic email check: one @, a dot in the domain, sane length. Not RFC-5322
// exhaustive (that's a known anti-pattern) — just enough to reject junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value.trim());
}

/**
 * Replace ASCII control characters (code point < 0x20, or 0x7F DEL) with
 * spaces, collapse runs of whitespace, trim, and cap length. Done by char code
 * to avoid control-character literals in a regex.
 */
export function sanitizeText(value: unknown, maxLength = 2000): string {
  if (typeof value !== 'string') return '';
  let out = '';
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    out += code < 0x20 || code === 0x7f ? ' ' : ch;
  }
  return out.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export interface FieldRule {
  required?: boolean;
  min?: number;
  max?: number;
  email?: boolean;
}

export type ValidationErrors = Record<string, string>;

/** Validate a map of fields, returning per-field error messages. */
export function validateFields(
  values: Record<string, string>,
  rules: Record<string, FieldRule>,
): ValidationErrors {
  const errors: ValidationErrors = {};
  for (const [field, rule] of Object.entries(rules)) {
    const value = (values[field] ?? '').trim();
    if (rule.required && !value) {
      errors[field] = 'This field is required.';
      continue;
    }
    if (!value) continue;
    if (rule.email && !isValidEmail(value)) {
      errors[field] = 'Enter a valid email address.';
    } else if (rule.min && value.length < rule.min) {
      errors[field] = `Please use at least ${rule.min} characters.`;
    } else if (rule.max && value.length > rule.max) {
      errors[field] = `Please keep this under ${rule.max} characters.`;
    }
  }
  return errors;
}
