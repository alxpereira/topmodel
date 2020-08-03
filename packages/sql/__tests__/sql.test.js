/* eslint-disable no-undef */
import { SQLPlugin, SQLPluginErrors } from '../src'
import mockKnex from 'mock-knex'

const PSQL_HOST = process.env.PSQL_HOST
const PSQL_USER = 'jest'
const PSQL_PASSWORD = 'jest'
const PSQL_DATABASE = 'jest'

describe('SQL Plugin Setup', () => {
  test('MongoPlugin is a Class', () => {
    const s = new SQLPlugin({
      client: 'pg',
      host: PSQL_HOST,
      user: PSQL_USER,
      password: PSQL_PASSWORD,
      database: PSQL_DATABASE
    })

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
  test('SQLPlugin.create should throw if no table is specified', async () => {
    const s = new SQLPlugin({
      client: 'pg',
      host: PSQL_HOST,
      user: PSQL_USER,
      password: PSQL_PASSWORD,
      database: PSQL_DATABASE
    })

    try {
      expect(await s.create(null, {})).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingTable)
    }
  })

  test('SQLPlugin.create should throw if no data is specified', async () => {
    const s = new SQLPlugin({
      client: 'pg',
      host: PSQL_HOST,
      user: PSQL_USER,
      password: PSQL_PASSWORD,
      database: PSQL_DATABASE
    })

    try {
      expect(await s.create('foo')).toThrow()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(SQLPluginErrors.MissingData)
    }
  })

  test('SQLPlugin.create should throw if no data is specified', async () => {
    const s = new SQLPlugin({
      client: 'pg',
      host: PSQL_HOST,
      user: PSQL_USER,
      password: PSQL_PASSWORD,
      database: PSQL_DATABASE
    })

    mockKnex.mock(s.knex)

    await s.create('foo', { foo: 'bar' })
  })
})
