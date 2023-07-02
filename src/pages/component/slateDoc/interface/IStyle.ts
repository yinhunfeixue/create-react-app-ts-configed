import { CSSProperties } from 'react';

/**
 * IStyle
 */
export default interface IStyle extends CSSProperties {}

const NAME_TO_NAME: { [key in keyof IStyle]: string } = {
  fontSize: 'font-size',
  fontWeight: 'font-weight',
};

const NUMBER_TO_STRING: {
  [key in keyof IStyle]: boolean | (() => string);
} = {
  fontSize: true,
};

export function IStyletoString(data?: IStyle) {
  if (!data) {
    return '';
  }
  let result = [];
  for (const key in data) {
    const value = data[key];
    const effectName = NAME_TO_NAME[key] || key;
    let effectValue: string | number = value;
    if (typeof value === 'number') {
      const translateFun = NUMBER_TO_STRING[key];
      if (typeof translateFun === 'function') {
        effectValue = translateFun(value);
      } else if (translateFun === true) {
        effectValue = `${value}px`;
      }
    }
    result.push(`${effectName}:${effectValue}`);
  }
  return result.join(';');
}
