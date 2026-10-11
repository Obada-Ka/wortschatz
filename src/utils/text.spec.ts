import { compareGerman, foldText } from './text'

describe('foldText', () => {
  it('ignores case and umlauts so "uber" finds "Über"', () => {
    expect(foldText('Über')).toBe('uber')
  })

  it('treats ß as ss', () => {
    expect(foldText('Straße')).toBe('strasse')
  })

  it('trims whitespace', () => {
    expect(foldText('  Haus ')).toBe('haus')
  })
})

describe('compareGerman', () => {
  it('sorts umlauts next to their base letter', () => {
    expect(['Zug', 'Äpfel', 'Arzt'].sort(compareGerman)).toEqual(['Äpfel', 'Arzt', 'Zug'])
  })
})
