var error = new ReactiveVar()

Template.createMedialist.helpers({
  error: function () {
    return error.get()
  }
})

Template.createMedialist.events({
  'submit': function (evt, tpl) {
    evt.preventDefault()

    var medialist = {
      name: tpl.$('#medialist-name').val(),
      client: { name: tpl.$('#medialist-client').val() },
      purpose: tpl.$('#medialist-purpose').val()
    }
    if (Template.currentData().contacts) {
      medialist.contacts = _.reduce(Template.currentData().contacts, function (contactObj, contactSlug) {
        contactObj[contactSlug] = Contacts.status.toContact
        return contactObj
      }, {})
    }

    tpl.$('#addMedialist').get(0).reset()

    Meteor.call('medialists/create', medialist, function (err) {
      if (err) return error.set(err.reason)
      Modal.hide()
      FlowRouter.go('medialist', { slug: medialist.name })
      FlowRouter.reload()
    })
  }
})
