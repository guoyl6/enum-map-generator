import { Language } from "./interfaces";
import { ERROR_MESSAGES, LINE_TEMPLATE, SNIPPETS } from "./resources";
import { findContents, findEnumFieldNameDescriptionJs, findEnumFieldNameDescriptionTs, findLang, removeValuesJs, removeValuesTs, splitAndCleanContentsJs, splitAndCleanContentsTs } from "./utils";

export const generateSnippet = (str: string) => {
  const lang = findLang(str);
  const generator = SNIPPET_GENERATORS[lang];
  return generator(str);
};

const generateSnippetFromTs = (str: string): string => {
  const lang = Language.typeScript;
  const contents = findContents(str);
  if (!contents) {
    throw new Error(ERROR_MESSAGES.noValidEnum);
  }

  const enumName = ENUM_NAME_FINDERS[lang](str);
  const cleanedContents = splitAndCleanContentsTs(contents);
  const cleanedValue = removeValuesTs(cleanedContents);
  const lineGenerator = LINE_GENERATORS[lang](enumName);
  const lines = cleanedValue.map((name) => lineGenerator(name, ENUM_DESCRIPTION_FINDERS[lang](str, name)));
  return SNIPPETS[lang](enumName, lines, cleanedValue);
};

const generateSnippetFromJs = (str: string) => {
  const lang = Language.javaScript;
  const contents = findContents(str);
  if (!contents) {
    throw new Error(ERROR_MESSAGES.noValidEnum);
  }

  const enumName = ENUM_NAME_FINDERS[lang](str);
  const cleanedContents = splitAndCleanContentsJs(contents);
  const cleanedValue = removeValuesJs(cleanedContents);
  const lineGenerator = LINE_GENERATORS[lang](enumName);
  const lines = cleanedValue.map((name) => lineGenerator(name, ENUM_DESCRIPTION_FINDERS[lang](str, name)));
  return SNIPPETS[lang](enumName, lines, cleanedValue);
};

const SNIPPET_GENERATORS = {
  [Language.javaScript]: generateSnippetFromJs,
  [Language.typeScript]: generateSnippetFromTs,
};

const generateLine = (enumName: string) => (str: string, value?: string) => LINE_TEMPLATE(enumName, str, value);

const generateLineFromTs = generateLine;
const generateLineFromJs = generateLine;

const LINE_GENERATORS = {
  [Language.javaScript]: (enumName: string) => generateLineFromJs(enumName),
  [Language.typeScript]: (enumName: string) => generateLineFromTs(enumName),
};

const findEnumNameBase = (str: string) => {
  return str.match(/enum ([^ \{]*)/)?.[1] ?? 'unknown';
};

const findEnumNameFromJs = findEnumNameBase;
const findEnumNameFromTs = findEnumNameBase;

const ENUM_NAME_FINDERS = {
  [Language.javaScript]: findEnumNameFromJs,
  [Language.typeScript]: findEnumNameFromTs,
};


const ENUM_DESCRIPTION_FINDERS = {
  [Language.javaScript]: findEnumFieldNameDescriptionJs,
  [Language.typeScript]: findEnumFieldNameDescriptionTs,
};
