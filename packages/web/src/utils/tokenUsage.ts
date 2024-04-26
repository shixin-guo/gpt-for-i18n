import { encodingForModel } from 'js-tiktoken';
const enc = encodingForModel('gpt-3.5-turbo');
export const getTokenUsageForPage = (code: string) => {
  return enc.encode(code).length;
};
