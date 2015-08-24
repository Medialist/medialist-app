# Medialist

Data structure

**medialist**

```js
{
  createdBy: 'userId',
  createdAt: 'timestamp',
  name: '',
  purpose: '',
  slug: '',
  contacts: ['contactId']
}
```


**contacts**

```js
{
  createdBy: 'userId',
  createdAt: 'timestamp',
  medialists: {
    'slug': 'status' // ?
  },
  name: 'Jane Smith',
  twitter: 'janesmith',
  title: 'Contributor',
  org: 'PR Public Relations',
  bio: 'Lorem ipsum...',
  emails: [{
    address: 'jane.smith@pr.com',
    type: 'work' // ?
  }],
  phones: [{
    number: '01234567890',
    type: 'work' // ?
  }],
  slug: 'janesmith' // ?
}
```

**feedback**

```js
{
  createdBy: 'userId',
  createdAt: 'timestamp',
  message: 'Spoke to @janesmith about #medialist, she loves it',
  contacts: ['janesmith'],
  medialists: ['medialist'],
  status: 'status'
}
```
