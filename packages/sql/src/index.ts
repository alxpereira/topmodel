import knex from 'knex'

interface SQLOptions {
  client: string
  host?: string
  user?: string
  password?: string
  database?: string
  filename?: string
  searchPath?: Array<string>
  socketPath?: string
}

interface SQLResult {
  id?: string
  data?: Record<string, any>,
  success?: boolean
}

export enum SQLPluginErrors {
  MissingOptions = 'Missing some options in Plugin instanciation',
  MissingTable = 'Missing table to target',
  MissingData = 'Missing data in query',
  MissingSelectorWhere = 'Missing where condition to target your object'
}

export class SQLPlugin {
  private dbtype: string
  public knex: any

  constructor (options: SQLOptions) {
    const { client, ...connection } = options || {}
    if (!client || !connection) throw new Error(SQLPluginErrors.MissingOptions)

    this.dbtype = client
    this.knex = knex({
      client,
      connection
    })
  }

  async create (table: string, data: Record<string, any>): Promise<SQLResult> {
    if (!table) throw new Error(SQLPluginErrors.MissingTable)
    if (!data) throw new Error(SQLPluginErrors.MissingData)

    const [result] = await this.knex(table).insert(data).returning('*')
    return { data: result }
  }

  async read (table: string, where: Record<string, any>): Promise<SQLResult> {
    if (!table) throw new Error(SQLPluginErrors.MissingTable)
    if (!where) throw new Error(SQLPluginErrors.MissingSelectorWhere)

    const [result] = await this.knex(table).where(where).returning('*')

    return { data: result }
  }

  async update (
    table: string,
    where: Record<string, any>,
    data: Record<string, any>
  ): Promise<SQLResult> {
    if (!table) throw new Error(SQLPluginErrors.MissingTable)
    if (!where) throw new Error(SQLPluginErrors.MissingSelectorWhere)
    if (!data) throw new Error(SQLPluginErrors.MissingData)

    const [result] = await this.knex(table)
      .where(where)
      .update(data)
      .returning('*')

    return { data: result }
  }

  async del (table: string, where: Record<string, any>): Promise<SQLResult> {
    if (!table) throw new Error(SQLPluginErrors.MissingTable)
    if (!where) throw new Error(SQLPluginErrors.MissingSelectorWhere)

    await this.knex(table).where(where).del()

    return { success: true }
  }
}
