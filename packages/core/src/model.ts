import { Schema, ValidationOutput, SchemaErrors } from './schema'

interface Options {
    exposer?: Record<string, Array<string>>,
    schema?: Schema,
    db?: any,
    table?: string
}

export enum ModelErrors {
  MissingDB = 'Cannot proceed a db-related action, no `db` connector specified',
  MissingId = 'Cannot proceed a get on database without an `id`'
}

export class Model {
    private id: string|number
    private data: Record<string, any>
    private options: Options

    constructor (data: Record<string, any>, options?: Options) {
      this.data = data || {}
      this.options = options || {}

      if (this.data.id || this.data._id) {
        this.id = this.data.id || this.data._id
      }
    }

    private get table () : string {
      return this.options.table || this.constructor.name.toLowerCase()
    }

    public get body (): Object {
      return this.data
    }

    validate () : Model {
      const { schema } = this.options
      if (!schema) throw new Error(SchemaErrors.NoSchema)

      const { errors } = schema.validate(this.data)
      if (errors) throw errors

      return this
    }

    public get validation (): ValidationOutput {
      const { schema } = this.options
      if (!schema) throw new Error(SchemaErrors.NoSchema)

      return schema.validate(this.data)
    }

    public expose (exposerType?: string): Object {
      if (!this.options.exposer || !exposerType) { return this.data }

      return Object.keys(this.data)
        .filter((key: string) => this.options.exposer![exposerType].includes(key))
        .reduce((obj:Record<string, any>, key: string) => {
          obj[key] = this.data[key]
          return obj
        }, {})
    }

    public async read (): Promise<Model> {
      const { db } = this.options
      if (!db) throw new Error(ModelErrors.MissingDB)
      if (!this.id) throw new Error(ModelErrors.MissingId)

      const { id, data } = await db.read(this.table, this.id)

      this.id = id
      this.data = data

      return this
    }

    public async save (): Promise<Model> {
      const { db } = this.options
      if (!db) throw new Error(ModelErrors.MissingDB)

      const { id, data } = this.id
        ? await db.update(this.table, this.data, this.id)
        : await db.create(this.table, this.data)

      this.id = id
      this.data = data

      return this
    }

    public async del (): Promise<Boolean> {
      const { db } = this.options
      if (!db) throw new Error(ModelErrors.MissingDB)
      if (!this.id) throw new Error(ModelErrors.MissingId)

      const { success } = await db.del(this.table, this.id)

      return success
    }
}
