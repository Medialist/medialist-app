Meteor.publish('contacts', function (string) {
  check(string, String)
  var regex = new RegExp(string, 'gi')
  var query = {
    name: {
      $regex: regex,
      $options: 'i'
    }
  }
  return Contacts.find(query)
})
