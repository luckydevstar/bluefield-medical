// Max 254 overall, max 64 before "@", valid domain labels, supports xn-- TLDs
export const EMAIL_STRICT =
  /^(?=.{1,254}$)(?=.{1,64}@)[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,63}|XN--[A-Z0-9-]{1,59})$/i;

export const isEmail = (s: string) => EMAIL_STRICT.test(s.trim());

export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

    