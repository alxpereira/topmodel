# `@topmodel/mongo`

Mongo connector (compatible with `topmodel` models)

## Install

With `npm`
```sh
npm install @topmodel/mongo
```

or `yarn`
```sh
yarn add @topmodel/mongo
```

## Usage

Setup your mongo connector Plugin and pass it in the model options:
```js
import { Model } from '@topmodel/core'
import { MongoPlugin } from '@topmodel/mongo'

const { MONGO_URL, MONGO_DATABASE } = process.env

const mongo = new MongoPlugin({
    url: MONGO_URL,
    database: MONGO_DATABASE
})

const options = { db: mongo }

class User extends Model {
    constructor(data){
        super(data, options)
    }
}

// User class is now ready to interact with Mongo !
```

You can then use your `User` model and persist its data within mongo
```js
// example : 

const user = new User({ email: 'foo@bar.co' })
const saved = await user.save()

console.log(saved) // saved user in mongo
```

## Collections

#### Note: by default topmodel core will attribute a table name related to your model name, for example model `User` will become  `user` table in SQL or collection in Mongo.

If you want to force the collection, please refer to the core model option `table` [here](../core/README.md#optionstable) 


## API

Topmodel db connectors has built-in methods extended to your models : 

| Method   |      Return      |  Comments |
|----------|:-------------|:------|
| `save()` |  Promise(Model) | create or update if `data.id` or `data._id`` is specified |
| `read()` |  Promise(Model) | will retrieve the data in the database (will require `id` or `_id`) |
| `del()` | Promise(Model) | will delete the data in the database (will require `id` or `_id`) |

### `save`
Create or update your model in mongo

```js 
// create
const user = new User({ email: 'foo@bar.co' })

const saved = await user.save()
console.log(saved.body) 
// { _id: '507f1f77bcf86cd799439011' , email: 'foo@bar.co' }

// or update

const user = new User({ _id: '507f1f77bcf86cd799439011', email: 'update@foo.co' })

const updated = await user.save()
console.log(updated.body)
// { _id: '507f1f77bcf86cd799439011', email: 'update@foo.co' }
```

### `read`
Read data from the database and populate the Model

```js 
const user = new User({ _id: '507f1f77bcf86cd799439011' })
await user.read()

console.log(user.body) 
// { _id: '507f1f77bcf86cd799439011' , email: 'foo@bar.co' }
```

### `del`
Delete data in the database

```js 
const user = new User({ _id: '507f1f77bcf86cd799439011' })
const deleted = await user.del()

console.log(deleted) // true 
```