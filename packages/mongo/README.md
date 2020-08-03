# `@topmodel/mongo`

Mongo connector (compatible with `topmodel` models)

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

## API

Topmodel db connectors has built-in methods extended to your models : 

| Method   |      Return      |  Comments |
|----------|:-------------|:------|
| `save()` |  Promise(Model) | create or update if `data.id` or `data._id`` is specified |
| `read()` |  Promise(Model) | will retrieve the data in the database (will require `id` or `_id`) |
| `del()` | Promise(Model) | will delete the data in the database (will require `id` or `_id`) |
