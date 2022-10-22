import { isDigit } from './isDigit'

describe('isDigit check strings for numbers', () => {
  it('check strings', () => {
    expect(isDigit('123')).toStrictEqual(true)
    expect(isDigit('0')).toStrictEqual(true)
    expect(isDigit('Ⅻ')).toStrictEqual(true)
    expect(isDigit('९३')).toStrictEqual(true)
    expect(isDigit('०१२३४५६७८९')).toEqual(true);

    expect(isDigit('st12r')).toStrictEqual(false)
    expect(isDigit('str')).toStrictEqual(false)
    expect(isDigit('Ⅻstr')).toStrictEqual(false)
  })
})