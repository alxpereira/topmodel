/* eslint-disable no-undef */
import { flatten } from '../src/utils'

test('MongoPlugin is a Class', () => {
  const data = {
    Key1: 1,
    Key2: {
      a: '2',
      c: {
        e: '1'
      }
    },
    Key3: {
      a: [
        {
          sub: 'sub1'
        },
        {
          sub: 'sub2'
        }
      ]
    }
  }

  const flatResult = flatten(data)

  expect(flatResult.Key1).toBe(1)
  expect(flatResult['Key2.a']).toBe('2')
  expect(flatResult['Key2.c.e']).toBe('1')
  expect(flatResult['Key3.a.1.sub']).toBe('sub2')
})
