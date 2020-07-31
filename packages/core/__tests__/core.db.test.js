/* eslint-disable no-undef */
import { Model, ModelErrors } from '../src'

const testData = { id: '123', data: { id: '123', foo: 'bar' } }
const testDataUpdated = { id: '123', data: { id: '123', foo: 'bar-updated' } }
const testDataDeleted = { id: '123', data: { id: '123', foo: 'bar' } }

class MockDB {
    create = jest.fn(() => Promise.resolve(testData))
    read = jest.fn(() => Promise.resolve(testData))
    update = jest.fn(() => Promise.resolve(testDataUpdated))
    del = jest.fn(() => Promise.resolve(testDataDeleted))
}

describe('Model Database', () => {
  test('Model.save should throw if no DB', async () => {
    class Test extends Model {}
    const data = { foo: 'bar' }
    const test = new Test(data)

    try {
      expect(await test.save()).toThrow()
    } catch (error) {
      expect(error.message).toBe(ModelErrors.MissingDB)
    }
  })

  test('Model.save should return the created model', async () => {
    const db = new MockDB()
    class Test extends Model {
      constructor (data) {
        super(data, { db })
      }
    }

    const data = { foo: 'bar' }
    const test = new Test(data)

    const t = await test.save()
    expect(t.body).toBeDefined()
    expect(db.create).toHaveBeenCalled()
    expect(t.body).toBe(testData.data)
  })

  test('Model.read should throw if no DB', async () => {
    class Test extends Model {}
    const data = { foo: 'bar' }
    const test = new Test(data)

    try {
      expect(await test.read()).toThrow()
    } catch (error) {
      expect(error.message).toBe(ModelErrors.MissingDB)
    }
  })

  test('Model.read should throw if no id', async () => {
    const db = new MockDB()
    class Test extends Model {
      constructor (data) {
        super(data, { db })
      }
    }

    const data = { foo: 'bar' }
    const test = new Test(data)

    try {
      expect(await test.read()).toThrow()
    } catch (error) {
      expect(error.message).toBe(ModelErrors.MissingId)
    }
  })

  test('Model.read should return the read model', async () => {
    const db = new MockDB()
    class Test extends Model {
      constructor (data) {
        super(data, { db })
      }
    }

    const data = { id: 123 }
    const test = new Test(data)

    const t = await test.read()
    expect(t.body).toBeDefined()
    expect(db.read).toHaveBeenCalled()
    expect(t.body).toBe(testData.data)
  })

  test('Model.save should return the updated model', async () => {
    const db = new MockDB()
    class Test extends Model {
      constructor (data) {
        super(data, { db })
      }
    }

    const data = { id: 123, foo: 'bar' }
    const test = new Test(data)

    const t = await test.save()
    expect(t.body).toBeDefined()
    expect(db.update).toHaveBeenCalled()
    expect(t.body).toBe(testDataUpdated.data)
  })

  test('Model.save is chainable', async () => {
    const db = new MockDB()
    class Test extends Model {
      constructor (data) {
        super(data, { db })
      }
    }

    const data = { foo: 'bar' }
    const test = new Test(data)

    const exposed = (await test.save()).expose()
    expect(exposed).toBeDefined()
    expect(exposed).toBe(testData.data)
  })
})
