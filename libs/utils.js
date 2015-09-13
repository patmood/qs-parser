'use strict'

// 'a[b][c]' -> ['a', 'b', 'c']
const parseKey = (key) => {
  return key.replace(/]/g, '').split('[')
}

// ([], [['a', 'b'], 'c']) -> [['a', [['b', 'c']]]]
// ([['a', [['b', 'c']]]], [['a, 'e'], f])
//   -> [['a', [ ['b','c'], ['e','f'] ]]]
const appendNestedValue = (listOfPairs = [], [fieldPath, fieldValue]) => {
  let [head, ...rest] = fieldPath
  const indexOfHead = listOfPairs.findIndex(([key, valOrListOfPairs]) => {
    return key === head
  })

  if (indexOfHead > -1) {
    // head of path already in list, concat our new pair
    const [head, valOrlistOfPairs] = listOfPairs[indexOfHead]

    if (rest.length === 0) {
      // have final value, concat this pair
      return listOfPairs.concat([[head, fieldValue]])
    }


    if (Array.isArray(valOrlistOfPairs)) {
      listOfPairs[indexOfHead] = [head, appendNestedValue(valOrlistOfPairs, [rest, fieldValue])]
      return listOfPairs
    } else {
      const val = valOrlistOfPairs  // << where is this relevant?
      return listOfPairs.concat([[head, appendNestedValue([], [rest, fieldValue])]])
    }

    return listOfPairs
  } else {
    // head of path not in list, concat to parent list
    if (rest.length === 0) {
      // we are at bottom level so add pair
      return listOfPairs.concat([[head, fieldValue]])
    } else {
      // append the next nested pair
      return listOfPairs.concat([[head, appendNestedValue([], [rest, fieldValue])]])
    }
  }
}

const pairListToObject = (pairList) => {
  return pairList.reduce((memo, [fieldKey, fieldValue]) => {
    if (Array.isArray(fieldValue)) {
      memo[fieldKey] = pairListToObject(fieldValue)
    } else {
      memo[fieldKey] = fieldValue
    }
    return memo
  }, {})
}

module.exports = {
  parseKey: parseKey,
  appendNestedValue: appendNestedValue,
  pairListToObject: pairListToObject
}
