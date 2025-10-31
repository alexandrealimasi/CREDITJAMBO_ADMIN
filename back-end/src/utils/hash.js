import crypto from 'crypto';

export const sha512 = (text) => {
  return crypto.createHash('sha512').update(String(text), 'utf8').digest('hex');
};
