var name = new ReactiveVar('')

Template.addContact.onCreated(function () {
  var tpl = this
  tpl.autorun(function () {
    tpl.subscribe('contacts', name.get())
  })
})

Template.addContact.onDestroyed(function () {
  name.set('')
})

Template.addContact.helpers({
  contacts: function () {
    var regex = new RegExp(name.get(), 'gi')
    var query = {
      name: {
        $regex: regex,
        $options: 'i'
      }
    }
    return Contacts.find(query)
  },
  name: function () {
    return name.get()
  }
});

Template.addContact.events({
  'keyup [data-field="contact-name"]': function (evt, tpl) {
    name.set(tpl.$(evt.currentTarget).val())
  },
  'submit, click [data-action="create-contact"]': function (evt) {
    evt.preventDefault()
    var context = { medialist: FlowRouter.getParam('slug') }
    var identifier = name.get()
    if (identifier.slice(0, 1) === '@') {
      context.screenName = identifier.slice(1)
    } else {
      context.name = identifier
    }
    name.set('')
    Modal.show('createContact', context)
  }
});

Template.contactRow.helpers({
  status: function () {
    var medialist = Medialists.findOne(FlowRouter.getParam('slug'))
    return medialist && medialist.contacts[this.slug]
  }
})

Template.contactRow.events({
  'click [data-action="add-contact"]': function () {
    Meteor.call('contacts/addToMedialist', this.slug, FlowRouter.getParam('slug'), function (err) {
      if (err) console.error(err)
    })
  }
})
