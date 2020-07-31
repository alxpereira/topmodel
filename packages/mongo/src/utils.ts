
export function flatten (input: Object) : Object {
  function flat (res, key, val, pre = '') {
    const prefix = [pre, key].filter(v => v).join('.')
    return typeof val === 'object'
      ? Object.keys(val).reduce((prev, curr) => flat(prev, curr, val[curr], prefix), res)
      : Object.assign(res, { [prefix]: val })
  }

  return Object.keys(input).reduce((prev, curr) => flat(prev, curr, input[curr]), {})
}
