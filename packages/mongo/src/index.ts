import { MongoClient } from 'mongodb'

interface MongoOptions {
  url: string,
  database: string
}

export enum MongoErrors {
  MissingOptions = 'Missing options at mongo instanciation, `database & url` are required',
}

export class MongoPlugin {
  dbType: string
  dbName: string
  mongoUrl: string

  client: Record<string, any>
  db: Record<string, any>

  constructor (options: MongoOptions) {
    if (!options || !options.database || !options.url) {
      throw new Error(MongoErrors.MissingOptions)
    }

    this.dbType = 'mongo'
    this.dbName = options.database
    this.mongoUrl = options.url
  }

  async connect () {
    const client = await MongoClient.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    this.client = client
    this.db = client.db(this.dbName)

    return { client: this.client, db: this.db }
  }

  async create (collection: string, data: Object) {
    await this.connect()
    const inserted = await this.db.collection(collection).insertOne(data)
    this.client.close()
    return inserted
  }
}
