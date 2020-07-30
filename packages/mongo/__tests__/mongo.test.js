/* eslint-disable no-undef */
// import { Model } from '@topmodel/core'
import { MongoPlugin, MongoErrors } from '../src'

const MONGO_URL = process.env.MONGO_URL
const MONGO_DATABASE = 'jest'

test('MongoPlugin is a Class', () => {
  const s = new MongoPlugin({
    database: 'foo',
    url: 'mongodb://blabla'
  })
  expect(s).toBeInstanceOf(MongoPlugin)
})

test('MongoPlugin instancation with no options should throw', () => {
  try {
    expect(new MongoPlugin()).toThrow()
  } catch (error) {
    expect(error.message).toBe(MongoErrors.MissingOptions)
  }
})

test('MongoPlugin instancation with partial options should throw', () => {
  try {
    expect(new MongoPlugin({ database: 'foo' })).toThrow()
  } catch (error) {
    expect(error.message).toBe(MongoErrors.MissingOptions)
  }
})

test('MongoPlugin should connect', async () => {
  const s = new MongoPlugin({
    url: MONGO_URL,
    database: MONGO_DATABASE
  })
  try {
    const { client, db } = await s.connect()
    expect(db).toBeDefined()
    expect(client).toBeDefined()
    client.close()
  } catch (error) {
    expect(error).not.toBeDefined()
  }
})

test('MongoPlugin create is defined', async () => {
  const s = new MongoPlugin({
    url: MONGO_URL,
    database: MONGO_DATABASE
  })
  expect(s.create).toBeDefined()
  expect(typeof s.create).toBe('function')
})

test('MongoPlugin create should create', async () => {
  const s = new MongoPlugin({
    url: MONGO_URL,
    database: MONGO_DATABASE
  })
  const inserted = await s.create('foo', { foo: 'bar ' })
  expect(inserted).toBeDefined()
  expect(inserted.insertedCount).toBe(1)
})
