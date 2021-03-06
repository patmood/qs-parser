/* global jest, it, expect, describe */

jest.autoMockOff()
const serialize = require('../libs/serialize')

let debugStore = []
const debug = (label, arg) => {
  debugStore.push([label, arg])
}

describe('serialize', () => {
  beforeEach(() => {
    debugStore = []
  })

  it('skips empty input', () => {
    const given = {}
    const expectedReturn = ''
    const expectedDebug = []

    const actual = serialize(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

  it('single pair', () => {
    const given = {a: 'b'}
    const expectedReturn = 'a=b'
    const expectedDebug = [
      ['nested pairs', [['a', 'b']] ],
      ['flat pairs', [[['a'], 'b']]]
    ]

    const actual = serialize(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

  it('multiple pairs', () => {
    const given = {a: 'b', c: 'd'}
    const expectedReturn = 'a=b&c=d'
    const expectedDebug = [
      ['nested pairs', [['a', 'b'], ['c', 'd']] ],
      ['flat pairs', [[['a'], 'b'], [['c'], 'd']] ]
    ]

    const actual = serialize(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

  it('nested pair', () => {
    const given = {a: {b: 'c'}}
    const expectedReturn = 'a[b]=c'
    const expectedDebug = [
      ['nested pairs', [['a', [['b', 'c']]]] ],
      ['flat pairs', [[['a', 'b'], 'c']]  ]
    ]

    const actual = serialize(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })

  it('complex nested pair', () => {
    const given = {a: {b: 'c', d: {e: 'f'}}}
    const expectedReturn = 'a[b]=c&a[d][e]=f'
    const expectedDebug = [
      ['nested pairs', [['a', [['b', 'c'], ['d', [['e', 'f']]]]]] ],
      ['flat pairs', [[['a', 'b'], 'c'], [['a', 'd', 'e'], 'f']]  ]
    ]

    const actual = serialize(given, debug)
    expect(actual).toEqual(expectedReturn)
    expect(debugStore).toEqual(expectedDebug)
  })
})
