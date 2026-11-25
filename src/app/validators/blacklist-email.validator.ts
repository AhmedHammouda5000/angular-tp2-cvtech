import { SchemaPath, validate } from '@angular/forms/signals';

/** Emails that are not allowed to log in */
export const BLACKLISTED_EMAILS = ['spam@spam.com', 'test@test.com', 'hacker@evil.com'];

/**
 * Custom Signal Forms validator: rejects any email that is in the blacklist.
 * Usage inside the form schema: blacklistEmail(f.email);
 */
export function blacklistEmail(
  path: SchemaPath<string>,
  blacklist: string[] = BLACKLISTED_EMAILS,
  message = 'Cet email est blacklisté',
): void {
  validate(path, ({ value }) => {
    const email = value().trim().toLowerCase();
    return blacklist.includes(email) ? { kind: 'blacklist', message } : null;
  });
}
