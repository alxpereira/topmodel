import { Schema, ValidationOutput, SchemaErrors } from './schema'

interface Options {
    exposer?: Record<string, Array<string>>,
    schema?: Schema,
    db?: any
}

export class Model {
    private data: Record<string, any>
    private options: Options

    constructor (data: Object, options?: Options) {
      this.data = data
      this.options = options || {}
    }

    public get body (): Object {
      return this.data
    }

    public get validation (): ValidationOutput {
      const { schema } = this.options
      if (!schema) throw new Error(SchemaErrors.NoSchema)

      return schema.validate(this.data)
    }

    public expose (exposerType?: string): Object {
      if (!this.options || !this.options.exposer) { return this.data }

      return Object.keys(this.data)
        .filter((key) => this.options.exposer[exposerType].includes(key))
        .reduce((obj:Record<string, any>, key: string) => {
          obj[key] = this.data[key]
          return obj
        }, {})
    }
}
