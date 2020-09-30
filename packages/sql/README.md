# `@topmodel/sql`

SQL connector (compatible with `topmodel` models)
#### Note: this plugin is a wrapper around [Knex.js](http://knexjs.org/)

## Install

With `npm`
```sh
npm install @topmodel/sql
```

or `yarn`
```sh
yarn add @topmodel/sql
```
#### Then add one of the following, depending on your install
```
npm install pg
npm install sqlite3
npm install mysql
npm install mysql2
npm install oracledb
npm install mssql
```

For the following documentation, we will use Postgresql (pg) as an example 

## Usage

Setup your SQL connector Plugin and pass it through the model options:
```js
import { Model } from '@topmodel/core'
import { SQLPlugin } from '@topmodel/sql'

const { 
    PSQL_HOST, 
    PSQL_USER, 
    PSQL_PASSWORD, 
    PSQL_DB 
} = process.env

const pg = new SQLPlugin({
  client: 'pg',
  host: PSQL_HOST,
  user: PSQL_USER,
  password: PSQL_PASSWORD,
  database: PSQL_DB
})

const options = { db: pg }

class User extends Model {
    constructor(data){
        super(data, options)
    }
}

// User class is now ready to interact with PSQL !
```

You can then use your `User` model and persist its data within Postgresql (or any other Knex compatible database)
```js
// example : 

const user = new User({ email: 'foo@bar.co' })
const saved = await user.save()

console.log(saved) // saved user in psql
```

## Table

#### Note: by default topmodel core will attribute a table name related to your model name, for example model `User` will become  `user` table in SQL.

If you want to force the collection, please refer to the core model option `table` [here](../core/README.md#optionstable) 


## API

Topmodel db connectors has built-in methods extended to your models : 

| Method   |      Return      |  Comments |
|----------|:-------------|:------|
| `save()` |  Promise(Model) | create or update if `data.id` or `data._id`` is specified |
| `read()` |  Promise(Model) | will retrieve the data in the database (will require `id`) |
| `del()` | Promise(Model) | will delete the data in the database (will require `id`) |

### `save`
Create or update your model in psql

```js 
// create
const user = new User({ email: 'foo@bar.co' })

const saved = await user.save()
console.log(saved.body) 

// or update

const user = new User({ 
    id: 'b9f8c112-0750-42eb-a146-a81be4c1df64', 
    email: 'update@foo.co' 
})
const updated = await user.save()
console.log(updated.body)
```

### `read`
Read data from the database and populate the Model

```js 
const user = new User({ 
    id: 'b9f8c112-0750-42eb-a146-a81be4c1df64' 
})
await user.read()

console.log(user.body) 
// { id: 'b9f8c112-0750-42eb-a146-a81be4c1df64' , email: 'foo@bar.co' }
```

### `del`
Delete data in the database

```js 
const user = new User({ id: 'b9f8c112-0750-42eb-a146-a81be4c1df64' })
const deleted = await user.del()

console.log(deleted) // true 
```