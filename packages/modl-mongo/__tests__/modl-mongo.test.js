/* eslint-disable no-undef */
// import { Model } from 'modl'
import MongoPlugin from '../src'

test('MongoPlugin is a Class', () => {
  const s = new MongoPlugin()
  expect(s).toBeInstanceOf(MongoPlugin)
})
