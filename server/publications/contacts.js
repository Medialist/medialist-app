Meteor.publish('contacts', function (string) {
  if (typeof string !== 'string') string = ''
  var regex = new RegExp(string, 'gi')
  var query = {
    name: {
      $regex: regex,
      $options: 'i'
    }
  }
  return Contacts.find(query, {limit: 7})
})

Meteor.publish('contact', function (slug) {
  check(slug, String)
  return Contacts.find({slug: slug})
})
