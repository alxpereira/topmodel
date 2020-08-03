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
    id: string,
    data: Record<string, any>
}

export enum SQLPluginErrors {
  MissingOptions = 'Missing some options in Plugin instanciation',
  MissingTable = 'Missing table to target',
  MissingData = 'Missing data in query'
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

    const results = await this.knex(table).insert(data).returning('*')
    return results
  }
}
