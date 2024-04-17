import { Buffer } from 'buffer';

export const encode = (text: string) => Buffer.from(text).toString('base64');
