# Medialist

## Settings

To run Medialists, you need to specify a *settings.json* and pass it as follows:

*settings.json*
```json
{
  "twitter": {
    "consumer_key": "###",
    "consumer_secret": "###",
    "access_token_key": "###",
    "access_token_secret": "###"
  }
}
```

```sh
$ meteor --settings settings.json
```

## Running Nightwatch tests

Install Selenium:

```sh
$ npm install -g selenium-server
```

Install Nightwatch:

```sh
$ npm install -g nightwatch
```

You need to run Meteor **using a test database**.  If you do not specify an alternative database, the tests will wipe your local app DB!  Assuming you don't want this to happen, make sure you're running a mongod as a separate process on the default port 27017 and use:

```sh
$ MONGO_URL=mongodb://localhost:27017/medialist-test meteor --settings settings.json
```

Start selenium:

```sh
$ selenium
```

Run the tests with Nightwatch:

```sh
$ nightwatch -c .meteor/nightwatch.json
```

## Data structure

**medialist**

```js
{
  createdBy: 'userId',
  createdAt: 'timestamp',
  name: '',
  purpose: '',
  slug: '',
  contacts: ['contactSlug']
}
```


**contact**

```js
{
  createdBy: 'userId',
  createdAt: 'timestamp',
  medialists: {
    'medialistSlug': 'status'
  },
  name: 'Jane Smith',
  avatar: 'http://example.com/myImage.png',
  twitter: {
    screenName: 'janesmith',
    id: '234532453463'
  },
  roles: [
    {
      title: 'Contributor',
      org: 'PR Public Relations',
      email: 'jane.smith@pr.com',
      phones: [{
        number: '01234567890',
        type: 'landline'
      }]
    }
  ],
  bio: 'Lorem ipsum...',
  slug: 'janesmith' // Twitter handle if available, otherwise autogenerated
}
```

**post**

```js
{
  createdBy: {
    _id: 'userId',  
    name: 'User Name'
  },
  createdAt: 'timestamp',
  message: 'Spoke to @janesmith about #medialist, she loves it',
  contacts: ['janesmith'],
  medialists: ['medialist'],
  status: 'status'
}
```
