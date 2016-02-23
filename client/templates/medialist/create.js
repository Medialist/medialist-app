
Template.createMedialist.onCreated(function () {
  this.error = new ReactiveVar()
})

Template.createMedialist.onRendered(function () {
  $('.typeahead').typeahead({
    source: function (query, cb) {
      Meteor.call('clients/search', query, function (err, res) {
        if (err) return console.error(err)
        cb(res)
      })
    },
    items: 5
  })
})

Template.createMedialist.helpers({
  error: function () {
    return Template.instance().error.get()
  }
})

Template.createMedialist.events({
  'blur #medialist-name' (evt) {
    var field = $(evt.currentTarget)
    var val = field.val()
    var name = val.replace(/[^a-z0-9]/gi, '')
    if (name !== val) field.val(name)
  },
  submit: function (evt, tpl) {
    evt.preventDefault()

    var medialist = {
      name: tpl.$('#medialist-name').val(),
      client: { name: tpl.$('#medialist-client').val() },
      purpose: tpl.$('#medialist-purpose').val(),
      topics: tpl.$('#medialist-topics').val().split(/\s*,\s*/g).filter(t => !!t)
    }

    if (Template.currentData().contacts) {
      medialist.contacts = _.reduce(Template.currentData().contacts, function (contactObj, contactSlug) {
        contactObj[contactSlug] = Contacts.status.toContact
        return contactObj
      }, {})
    }

    tpl.$('#addMedialist').get(0).reset()

    Meteor.call('medialists/create', medialist, function (err, slug) {
      if (err) return tpl.error.set(err.reason)
      Modal.hide()
      FlowRouter.go('medialist', { slug: slug })
      FlowRouter.reload()
    })
  }
})
