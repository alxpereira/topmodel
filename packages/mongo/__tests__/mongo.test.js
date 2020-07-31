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

describe('Mongo Plugin - create', () => {
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
    const data = { foo: 'bar' }

    const result = await s.create('foo', data)
    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.data).toBe(data)
  })

  test('MongoPlugin create should throw an error if no collection specified', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })
    try {
      expect(await s.create(null, { foo: 'bar' })).toThrow()
    } catch (error) {
      expect(error.message).toBe(MongoErrors.MissingCollectionOrData)
    }
  })

  test('MongoPlugin create should throw an error if no data specified', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })
    try {
      expect(await s.create('foo')).toThrow()
    } catch (error) {
      expect(error.message).toBe(MongoErrors.MissingCollectionOrData)
    }
  })
})

describe('Mongo Plugin - read', () => {
  test('MongoPlugin read should read', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })
    const data = { foo: 'bar' }
    const inserted = await s.create('foo', data)
    expect(inserted).toBeDefined()

    const result = await s.read('foo', inserted.id)
    expect(result).toBeDefined()
    expect(result.data).toBeDefined()
    expect(result.data.foo).toBe(data.foo)
  })

  test('MongoPlugin read should return null when invalid id', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })
    const result = await s.read('foo', 'blablabla')
    expect(result).toBeNull()
  })

  test('MongoPlugin read should throw an error if no collection specified', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })

    try {
      expect(await s.read(null, 'blabla')).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(MongoErrors.MissingCollection)
    }
  })

  test('MongoPlugin read should throw an error if no id specified', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })

    try {
      expect(await s.read('foo')).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(MongoErrors.MissingId)
    }
  })
})

describe('Mongo Plugin - update', () => {
  test('MongoPlugin update should update', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })
    const data = { foo: 'bar' }
    const updateData = { foo: 'bar-update' }

    const inserted = await s.create('foo', data)
    expect(inserted).toBeDefined()
    const updated = await s.update('foo', updateData, inserted.id)
    expect(updated).toBeDefined()
    expect(updated.data).toBeDefined()
    expect(updated.data.foo).toBe(updateData.foo)
  })

  test('MongoPlugin update should update (id from data._id)', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })
    const data = { foo: 'bar' }

    const inserted = await s.create('foo', data)
    expect(inserted).toBeDefined()
    const updateData = { foo: 'bar-update' }
    const updated = await s.update('foo', Object.assign(inserted.data, updateData))
    expect(updated).toBeDefined()
    expect(updated.data).toBeDefined()
    expect(updated.data.foo).toBe(updateData.foo)
  })

  test('MongoPlugin update should throw an error if no collection specified', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })
    try {
      const data = { foo: 'bar' }
      const inserted = await s.create('foo', data)
      expect(inserted).toBeDefined()
      expect(await s.update(null, { foo: 'bar-update' }, inserted.id)).toThrow()
    } catch (error) {
      expect(error.message).toBe(MongoErrors.MissingCollectionOrData)
    }
  })

  test('MongoPlugin update should throw an error if no data specified', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })
    try {
      const data = { foo: 'bar' }
      const inserted = await s.create('foo', data)
      expect(inserted).toBeDefined()
      expect(await s.update('foo', null, inserted.id)).toThrow()
    } catch (error) {
      expect(error.message).toBe(MongoErrors.MissingCollectionOrData)
    }
  })

  test('MongoPlugin update should throw an error if no id specified', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })
    try {
      const data = { foo: 'bar' }
      expect(await s.update('foo', data)).toThrow()
    } catch (error) {
      expect(error.message).toBe(MongoErrors.MissingId)
    }
  })
})

describe('Mongo Plugin - delete', () => {
  test('MongoPlugin del should delete', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })
    const data = { foo: 'bar' }
    const inserted = await s.create('foo', data)
    expect(inserted).toBeDefined()

    const result = await s.del('foo', inserted.id)
    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.id).toBe(inserted.id)
  })

  test('MongoPlugin del should throw an error if deletion has not occured', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })

    try {
      expect(await s.del('foo', 'randomID')).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(MongoErrors.CouldNotDelete)
    }
  })

  test('MongoPlugin del should throw an error if no collection specified', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })

    try {
      expect(await s.del(null, 'blabla')).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(MongoErrors.MissingCollection)
    }
  })

  test('MongoPlugin del should throw an error if no id specified', async () => {
    const s = new MongoPlugin({
      url: MONGO_URL,
      database: MONGO_DATABASE
    })

    try {
      expect(await s.del('foo')).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(MongoErrors.MissingId)
    }
  })
})
