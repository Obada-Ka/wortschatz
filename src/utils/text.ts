/**
 * Lower-cases and strips diacritics so a search for "uber" finds "über" and
 * "strasse" finds "Straße".
 */
export function foldText(value: string): string {
  return value
    .toLocaleLowerCase('de')
    .replaceAll('ß', 'ss')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
}

export function compareGerman(a: string, b: string): number {
  return a.localeCompare(b, 'de')
}
