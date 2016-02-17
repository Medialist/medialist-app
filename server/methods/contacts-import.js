Meteor.methods({
  'contacts/import' (contacts) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can import contacts')
    this.unblock()

    check(contacts, [{
      emails: Match.Optional([{label: String, value: String}]),
      socials: Match.Optional([{label: String, value: String}]),
      phones: Match.Optional([{label: String, value: String}]),
      name: Match.Optional(String),
      address: Match.Optional(String),
      primaryOutlets: Match.Optional(String),
      otherOutlets: Match.Optional(String),
      sectors: Match.Optional(String),
      jobTitles: Match.Optional(String),
      languages: Match.Optional(String),
      importedData: {columns: [String], row: [String]}
    }])

    console.log(`Importing ${contacts.length} contacts`)

    contacts.forEach(contactData => {
      if (contactData.emails && contactData.emails.length) {
        var emails = contactData.emails.map(e => e.value)
        var contact = Contacts.findOne({'emails.value': {$in: emails}})

        if (contact) {
          mergeContact(contactData, contact)
        } else {
          createContact(contactData)
        }
      } else {
        createContact(contactData)
      }
    })
  }
})

function createContact (data) {
  console.log(`Creating contact ${data.name}`)
  data.importedData = [{data: data.importedData, importedAt: new Date()}]
  return Contacts.insert(data)
}

function mergeContact (data, contact) {
  console.log(`Merging contact ${data.name}`)

  ;['emails', 'socials', 'phones'].forEach(key => {
    contact[key] = mergeLabelValueLists(contact[key], data[key])
  })

  ;[
    'name',
    'address',
    'primaryOutlets',
    'otherOutlets',
    'sectors',
    'jobTitles',
    'languages'
  ].forEach(key => {
    if (!contact[key] && data[key]) {
      contact[key] = data[key]
    }
  })

  contact.importedData = contact.importedData || []
  contact.importedData.push({data: data.importedData, importedAt: new Date()})

  return Contacts.update({_id: data._id}, {$set: data})
}

function mergeLabelValueLists (oldList, newList) {
  oldList = oldList || []
  newList = newList || []

  var newItems = newList.reduce((list, newItem) => {
    var newValue = newItem.value.toLowerCase()
    var exists = oldList.some(oldItem => oldItem.value.toLowerCase() === newValue))
    return exists ? list : list.concat(newItem)
  }, [])

  return oldList.concat(newItems)
}
