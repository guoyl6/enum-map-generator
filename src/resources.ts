import { Language } from "./interfaces";
import { camelToWord, toCammelCale } from "./utils";

const SNIPPETS_JS = (enumName: string, lines: string[], enumFields: string[]) =>
  `export const ${toCammelCale(enumName + '_Constant')} = {
    ${lines.join(",\n	")},
} as const;

export const ${toCammelCale(enumName + '_Values')} = [
    ${enumFields.map(enumFieldName => `${enumName}.${enumFieldName}`).join(',\n    ')},
] as const;
`;

const SNIPPETS_TS = (enumName: string, lines: string[], enumFields: string[]) =>
  `export const ${toCammelCale(enumName + '_Constant')} = {
    ${lines.join(",\n	")},
} as const;

export const ${toCammelCale(enumName + '_Values')} = [
    ${enumFields.map(enumFieldName => `${enumName}.${enumFieldName}`).join(',\n    ')},
] as const;

export const ${toCammelCale(enumName + '_Options_Data')} = ${toCammelCale(enumName + '_Values')}.map(value => ({
    id: value,
    name: ${toCammelCale(enumName + '_Constant')}[value]
}));
`;

export const LINE_TEMPLATE = (enumName: string, enumFieldName: string, value=camelToWord(enumFieldName)) => `[${enumName}.${enumFieldName}]: '${value}'`;

export const SNIPPETS = {
  [Language.javaScript]: SNIPPETS_JS,
  [Language.typeScript]: SNIPPETS_TS,
};

export const ERROR_MESSAGES = {
  noValidEnum: "There is no valid enum in your clipboard",
};
