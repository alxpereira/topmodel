/* eslint-disable no-undef */
import { Schema, SchemaErrors } from '../src'

test('Schema is a Class', () => {
  const s = new Schema()
  expect(s).toBeInstanceOf(Schema)
})

test('Schema().validate is defined', () => {
  const s = new Schema()
  expect(s.validate).toBeDefined()
  expect(typeof s.validate).toBe('function')
})

test('Schema().validate is validating a simple data', () => {
  const s = new Schema({
    firstname: {
      type: String
    }
  })

  const data = { firstname: 'Jean-Michel' }
  const { values } = s.validate(data)
  expect(values).toBeDefined()
  expect(values.firstname).toBe(data.firstname)
})

test('Schema().validate should throw if not presenting an object', () => {
  const s = new Schema({
    firstname: {
      type: String
    }
  })

  const data = [{ firstname: 'Jean-Michel' }]
  const { errors } = s.validate(data)
  expect(errors).toBeDefined()
  expect(errors[0].key).toBe('[root]')
  expect(errors[0].message).toContain(SchemaErrors.ShouldBeObject)
})

test('Schema().validate should return errors when invalid data - not in schema', () => {
  const s = new Schema({
    firstname: {
      type: String
    }
  })

  const data = { firstname: 'Jean-Michel', lastname: 'Doe' }
  const { errors } = s.validate(data)
  expect(errors).toBeDefined()
  expect(errors[0].key).toBe('lastname')
  expect(errors[0].message).toContain(SchemaErrors.NotInSchema)
})

test('Schema().validate should return errors when invalid data - invalid type', () => {
  const s = new Schema({
    firstname: {
      type: String
    }
  })

  const data = { firstname: 398746 }
  const { errors } = s.validate(data)
  expect(errors).toBeDefined()
  expect(errors[0].key).toBe('firstname')
  expect(errors[0].message).toContain(SchemaErrors.TypeError)
})

test('Schema().validate should return errors when invalid data - required property', () => {
  const s = new Schema({
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String
    }
  })

  const data = { lastname: 'Doe' }
  const { errors } = s.validate(data)
  expect(errors).toBeDefined()
  expect(errors[0].key).toBe('firstname')
  expect(errors[0].message).toContain(SchemaErrors.Required)
})

test('Schema().validate should return errors when invalid data - required property', () => {
  const DEFAULT_FIRSTNAME = 'John'
  const DEFAULT_LASTNAME = 'Doe'
  const s = new Schema({
    firstname: {
      type: String,
      required: true,
      default: DEFAULT_FIRSTNAME
    },
    lastname: {
      type: String,
      default: DEFAULT_LASTNAME
    }
  })

  const data = {}
  const { values } = s.validate(data)
  expect(values).toBeDefined()
  expect(values.firstname).toBe(DEFAULT_FIRSTNAME)
  expect(values.lastname).toBe(DEFAULT_LASTNAME)
})

test('Schema().validate nested object', () => {
  const s = new Schema({
    car: {
      type: Object,
      sub: {
        model: {
          type: Object,
          sub: {
            name: {
              type: String
            }
          }
        }
      }
    }
  })

  const data = {
    car: {
      model: {
        name: 'Lada'
      }
    }
  }

  const { values, errors } = s.validate(data)
  expect(values).toBeDefined()
  expect(values.car.model.name).toBe(data.car.model.name)
  expect(errors).toBeUndefined()
})

test('Schema().validate nested object (invalid)', () => {
  const s = new Schema({
    car: {
      type: Object,
      sub: {
        model: {
          type: Object,
          sub: {
            name: {
              type: String
            }
          }
        }
      }
    }
  })

  const data = {
    car: {
      model: {
        name: 1893798
      }
    }
  }

  const { values, errors } = s.validate(data)
  expect(errors).toBeDefined()
  expect(values).toBeUndefined()
})

test('Schema().validate nested object (default + required)', () => {
  const DEFAULT_DATE = new Date()
  const DEFAULT_STOCK = 99

  const s = new Schema({
    car: {
      type: Object,
      sub: {
        model: {
          type: Object,
          sub: {
            name: {
              type: String
            },
            created_at: {
              type: Date,
              required: true,
              default: DEFAULT_DATE
            },
            stock: {
              type: Number,
              default: DEFAULT_STOCK
            }
          }
        }
      }
    }
  })

  const data = {
    car: {
      model: {
        name: 'Lada'
      }
    }
  }

  const { values, errors } = s.validate(data)
  expect(errors).toBeUndefined()
  expect(values.car.model.name).toBe(data.car.model.name)
  expect(values.car.model.created_at).toBe(DEFAULT_DATE)
  expect(values.car.model.stock).toBe(DEFAULT_STOCK)
})
