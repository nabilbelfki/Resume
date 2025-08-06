import { Key } from './key.type'

export default (key: Key) => {
  return {
    bold: () => {},
    italic: () => {},
    underline: () => {},
    unorderedList: () => {},
    orderedList: () => {},
    quote: () => {},
    leftAligned: () => {},
    centerAligned: () => {},
    rightAligned: () => {},
    link: () => {},
    warning: () => {},
    code: () => {},
    media: () => {},
    checkbox: () => {},
    table: () => {},
    delimiter: () => {},
  }[key];
};