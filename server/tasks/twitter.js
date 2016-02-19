TwitterTask = {}

var conactUpdateQueue = []

function scheduleProcessContactUpdateQueue () {
  Meteor.setTimeout(processContactUpdateQueue, 60000)
}

scheduleProcessContactUpdateQueue()

function processContactUpdateQueue () {
  // We can only ask twitter for 100 user details at a time
  var ids = conactUpdateQueue.slice(0, 100)
  conactUpdateQueue = conactUpdateQueue.slice(100)

  var contacts = Contacts.find({_id: {$in: ids}}, {fields: {socials: 1}}).fetch()
  var screenNames = getScreenNames(contacts)

  if (!screenNames.length) return scheduleProcessContactUpdateQueue()

  console.log(`Updating ${screenNames.length} contacts`)

  TwitterClient.lookupUsersByScreenNames(screenNames, (err, users) => {
    if (err) {
      scheduleProcessContactUpdateQueue()
      return console.error('Failed to update contacts', screenNames, err)
    }

    users.forEach(user => {
      var contact = findContactByScreenName(user.screen_name, contacts)

      if (!contact) return

      console.log(`Updating contact ${contact._id}`)

      Contacts.update({_id: contact._id}, {$set: {
        avatar: user.profile_image_url_https,
        bio: user.description || contact.bio
      }})
    })

    scheduleProcessContactUpdateQueue()
  })
}

function getScreenNames (contacts) {
  return contacts.reduce((screenNames, contact) => {
    var social = (contact.socials || []).find(s => s.label === 'Twitter')
    return social ? screenNames.concat(social.value || '') : screenNames
  }, [])
}

function findContactByScreenName (screenName, contacts) {
  screenName = screenName.toLowerCase()
  return contacts.find(contact => {
    return (contact.socials || []).some(social => {
      return social.label === 'Twitter' && (social.value || '').toLowerCase() === screenName
    })
  })
}

TwitterTask.queueContactUpdate = (ids) => {
  console.log(`Queueing update for contact ${ids}`)
  conactUpdateQueue = conactUpdateQueue.concat(ids)
}
