/* eslint-disable no-undef */
import { SQLPlugin, SQLPluginErrors } from '../src'
import mockKnex from 'mock-knex'

const PSQL_HOST = '127.0.0.1'
const PSQL_USER = 'jest'
const PSQL_PASSWORD = 'jest'
const PSQL_DATABASE = 'foo'

const s = new SQLPlugin({
  client: 'pg',
  host: PSQL_HOST,
  user: PSQL_USER,
  password: PSQL_PASSWORD,
  database: PSQL_DATABASE
})

describe('SQL Plugin Setup', () => {
  test('MongoPlugin is a Class', () => {
    expect(s).toBeInstanceOf(SQLPlugin)
  })

  test('MongoPlugin is a Class', () => {
    try {
      expect(new SQLPlugin()).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingOptions)
    }
  })
})

describe('SQL Plugin - Create', () => {
  beforeEach(() => {
    mockKnex.mock(s.knex)
  })
  afterEach(() => {
    mockKnex.unmock(s.knex)
  })
  test('SQLPlugin.create should throw if no table is specified', async () => {
    try {
      expect(await s.create(null, {})).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingTable)
    }
  })

  test('SQLPlugin.create should throw if no data is specified', async () => {
    try {
      expect(await s.create('foo')).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingData)
    }
  })

  test('SQLPlugin.create should create', async () => {
    const tracker = mockKnex.getTracker()
    tracker.install()
    tracker.on('query', query => {
      query.response([{ foo: 'bar' }])
    })

    const data = { foo: 'bar' }
    const result = await s.create('foo', data)
    expect(result).toBeDefined()
    expect(result.data.foo).toBe(data.foo)
    tracker.uninstall()
  })
})

describe('SQL Plugin - Read', () => {
  beforeEach(() => {
    mockKnex.mock(s.knex)
  })
  afterEach(() => {
    mockKnex.unmock(s.knex)
  })
  test('SQLPlugin.read should throw if no table is specified', async () => {
    try {
      expect(await s.read(null, {})).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingTable)
    }
  })

  test('SQLPlugin.read should throw if no where condition is specified', async () => {
    try {
      expect(await s.read('foo')).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingSelectorWhere)
    }
  })

  test('SQLPlugin.read should read', async () => {
    const tracker = mockKnex.getTracker()
    tracker.install()
    tracker.on('query', query => {
      query.response([{ foo: 'bar' }])
    })

    const data = { foo: 'bar' }
    const result = await s.read('foo', data)
    expect(result).toBeDefined()
    expect(result.data.foo).toBe(data.foo)
    tracker.uninstall()
  })
})

describe('SQL Plugin - Update', () => {
  beforeEach(() => {
    mockKnex.mock(s.knex)
  })
  afterEach(() => {
    mockKnex.unmock(s.knex)
  })
  test('SQLPlugin.update should throw if no table is specified', async () => {
    try {
      expect(await s.update(null, {})).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingTable)
    }
  })

  test('SQLPlugin.update should throw if no where condition is specified', async () => {
    try {
      expect(await s.update('foo')).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingSelectorWhere)
    }
  })

  test('SQLPlugin.update should throw if no data is specified', async () => {
    try {
      expect(await s.update('foo', { foo: 'bar' })).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingData)
    }
  })

  test('SQLPlugin.update should update', async () => {
    const tracker = mockKnex.getTracker()
    const data = { foo: 'bar-update' }

    tracker.install()
    tracker.on('query', query => {
      query.response([data])
    })

    const result = await s.update('foo', { foo: 'bar' }, data)
    expect(result).toBeDefined()
    expect(result.data.foo).toBe(data.foo)
    tracker.uninstall()
  })
})

describe('SQL Plugin - Delete', () => {
  beforeEach(() => {
    mockKnex.mock(s.knex)
  })
  afterEach(() => {
    mockKnex.unmock(s.knex)
  })
  test('SQLPlugin.del should throw if no table is specified', async () => {
    try {
      expect(await s.del(null, {})).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingTable)
    }
  })

  test('SQLPlugin.del should throw if no where condition is specified', async () => {
    try {
      expect(await s.del('foo')).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingSelectorWhere)
    }
  })

  test('SQLPlugin.del should delete', async () => {
    const tracker = mockKnex.getTracker()
    const data = { foo: 'bar-update' }

    tracker.install()
    tracker.on('query', query => {
      query.response([data])
    })

    const result = await s.del('foo', { foo: 'bar' })
    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    tracker.uninstall()
  })
})
