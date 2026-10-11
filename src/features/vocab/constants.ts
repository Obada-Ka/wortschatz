import type { Article } from '@/domain/vocab'

export const ARTICLE_RULES: Record<Article, string> = {
  der: 'Masculine. Often days, months and seasons (der Juni, der Herbst) and many words built from verbs (der Kurs, der Spaß).',
  die: 'Feminine, and every plural. Always die: -ung, -heit, -keit, -ion and -in for women, and most words ending in -e. In the Dativ plural it is den + noun with -n.',
  das: 'Neuter. Often -um, -chen, -lein and -ment, and verbs used as nouns (das Leben).'
}

export const CASE_NAMES = { Akk: 'Akkusativ', Dat: 'Dativ', Gen: 'Genitiv' } as const
