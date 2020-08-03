class ValidationError {
  public message: string
  public key: string

  constructor (key: string, message: string) {
    this.key = key
    this.message = `Validation Error: ${message}`
  }
}

export interface ValidationOutput {
  errors?: Array<ValidationError>
  values?: Record<string, any>
}

export enum SchemaErrors {
  ShouldBeObject = 'validated data should be an object',
  NotInSchema = 'not in schema',
  TypeError = 'type error, should be:',
  Required = 'is required',
  NoSchema = 'Schema required to use validation'
}

export class Schema {
  constructor (schema: Record<string, unknown>) {
    this.schema = schema
  }

  private schema: Record<string, any>

  private verify (data: Record<string, any>, schema: Record<string, any>): ValidationOutput {
    let errors: ValidationError[] = []
    const values = {}
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof Object && !Array.isArray(value)) {
        const subOutput = this.verify(value, schema[key].sub)
        if (subOutput.values) {
          values[key] = subOutput.values
        }
        if (subOutput.errors) {
          errors = errors.concat(subOutput.errors)
        }
        continue
      }

      if (!schema[key]) {
        errors.push(new ValidationError(key, SchemaErrors.NotInSchema))
        continue
      }

      if (value.constructor !== schema[key].type) {
        errors.push(new ValidationError(key, `${SchemaErrors.TypeError} ${schema[key].type.name}`))
        continue
      }

      values[key] = value
    }

    for (const [key, value] of Object.entries(schema)) {
      if (value.type === Object && value.sub) {
        const subOutput = this.verify(data[key], value.sub)
        if (subOutput.values) {
          values[key] = subOutput.values
        }
        if (subOutput.errors) {
          errors = errors.concat(subOutput.errors)
        }
        continue
      }

      if (!data[key] && value.required) {
        if (!value.default) {
          errors.push(new ValidationError(key, SchemaErrors.Required))
        } else {
          values[key] = value.default
        }
      }

      if (!data[key] && value.default) {
        values[key] = value.default
      }
    }

    if (errors.length) return { errors }
    return { values }
  }

  validate (data: Record<string, any>): ValidationOutput {
    let output: ValidationOutput = {}

    if (data instanceof Object === false || Array.isArray(data)) {
      output.errors = [new ValidationError('[root]', SchemaErrors.ShouldBeObject)]
      return output
    }

    output = this.verify(data, this.schema)
    return output
  }
}
