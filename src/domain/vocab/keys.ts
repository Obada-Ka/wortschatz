import type { Modal, Noun, Verb } from './schema.ts'

const fold = (value: string): string => value.trim().toLocaleLowerCase('de')

/** Identity of a noun. Article is part of it because e.g. der See and die See differ. */
export const nounKey = (noun: Pick<Noun, 'article' | 'word'>): string =>
  `${noun.article}:${fold(noun.word)}`

export const verbKey = (verb: Pick<Verb, 'infinitive'>): string => fold(verb.infinitive)

export const modalKey = (modal: Pick<Modal, 'infinitive'>): string => fold(modal.infinitive)
