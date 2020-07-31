/* eslint-disable no-undef */
import { Model, Schema, SchemaErrors } from '../src'

test('Model is a Class', () => {
  const m = new Model()
  expect(m).toBeInstanceOf(Model)
})

test('Model().body is defined', () => {
  const data = { id: 123, foo: 'bar' }
  const m = new Model(data)
  expect(m.body).toBe(data)
})

test('Model().expose is defined', () => {
  const m = new Model({})
  expect(m.expose).toBeDefined()
  expect(typeof m.expose).toBe('function')
})

test('Model().expose() should return data', () => {
  const data = { _id: '123', foo: 'bar' }
  const m = new Model(data)
  expect(m.expose()).toBe(data)
})

test('Model Extended Class should have body', () => {
  class Test extends Model {}
  const data = { foo: 'bar' }
  const test = new Test(data)
  expect(test.body).toBe(data)
})

test('Model Extended Class with an exposer next to it', () => {
  class Foo extends Model {
    constructor (data) {
      super(data, {
        exposer: {
          public: [
            'firstname',
            'lastname'
          ]
        }
      })
    }
  }

  const data = { firstname: 'Han', lastname: 'Solo', email: 'falcon@millenium.space' }
  const test = new Foo(data)
  const exposed = test.expose('public')
  expect(exposed).not.toBe(data)
  expect(exposed.firstname).toBe(data.firstname)
  expect(exposed.lastname).toBe(data.lastname)
  expect(exposed.email).toBeUndefined()
})

test('Model validation without a schema should throw an error', () => {
  class Test extends Model {}
  const data = { foo: 'bar' }
  const test = new Test(data)
  try {
    expect(test.validation).toThrow()
  } catch (error) {
    expect(error.message).toBe(SchemaErrors.NoSchema)
  }
})

test('Model validation is validating a simple data', () => {
  class Test extends Model {
    constructor (data) {
      super(data, {
        schema: new Schema({
          firstname: {
            type: String
          }
        })
      })
    }
  }

  const TEST_FIRSTNAME = 'Jean-Michel'
  const test = new Test({ firstname: TEST_FIRSTNAME })

  const { values } = test.validation
  expect(values).toBeDefined()
  expect(values.firstname).toBe(TEST_FIRSTNAME)
})
