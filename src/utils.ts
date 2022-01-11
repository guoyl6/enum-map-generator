import { Language } from "./interfaces";

export const findLang = (str: string): Language => (/enum/.test(str) ? Language.typeScript : Language.javaScript);
export const findContents = (str: string) => /\{([\s\S]*?)\}/gm.exec(str)?.[1];
export const removeValuesTs = (str: string[]) => str.map((s) => s.replace(/\=.*./, "")?.trim());
export const removeValuesJs = (str: string[]) => str.map((s) => s.replace(/\:.*./, "")?.trim());
export const camelToWord = (str: string) =>
  str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    ?.trim();
export const pascalToUpper = (str: string) =>
  str
    .replace(/([A-Z])/g, "_$1")
    .replace("_", "")
    .toUpperCase()
    ?.trim();
export const toCammelCale = (str: string) =>
    str
        .trim()
        .toLowerCase()
        .replace(/[-_]([a-z])/g, (v, i) => i.toUpperCase())
        .replace(/^[a-z]/g, v => v.toUpperCase())
        .replace('Enum', '');

export const splitAndCleanContentsTs = (str: string) =>
  str
    .split(",")
    ?.filter((i) => !!i)
    ?.map((i) => getEnumFieldName(i, '=') ?? '')
    ?.filter((i) => !!i);
export const splitAndCleanContentsJs = (str: string) =>
  str
    .split(",")
    ?.filter((i) => !!i)
    ?.map((i) => getEnumFieldName(i, ':') ?? '')
    ?.filter((i) => !!i);
export const findEnumFieldNameDescriptionTs = (str: string, enumFieldName: string) => {
    const enumFieldLine = str.split(',').filter(i => !!i).find(i => getEnumFieldName(i, '=') === enumFieldName);
    return enumFieldLine?.match(/\/\*\*?(.*)\*\//)?.[1].trim() ?? enumFieldName;
}
export const findEnumFieldNameDescriptionJs = (str: string, enumFieldName: string) => {
    const enumFieldLine = str.split(',').filter(i => !!i).find(i => getEnumFieldName(i, ':') === enumFieldName);
    return enumFieldLine?.match(/\/\*\*?(.*)\*\//)?.[1].trim() ?? enumFieldName;
}

function getEnumFieldName(i: string, splitor?: ':' | '=') {
    return i.split('\n')
        .find(i => splitor ? i.indexOf(splitor) !== -1 : /[:=]/.test(i))
        ?.split(splitor ?? /[:=]/)[0]?.trim();
}