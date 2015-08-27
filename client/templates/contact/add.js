var name = new ReactiveVar('')

Template.addContact.onCreated(function () {
  var tpl = this
  tpl.autorun(function () {
    tpl.subscribe('contacts', name.get())
  })
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
    return Contacts.find(query, {limit:5})
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
    Modal.show('createContact', context)
  }
});

Template.contactRow.helpers({
  status: function () {
    return this.medialists[FlowRouter.getParam('slug')]
  }
})

Template.contactRow.events({
  'click [data-action="add-contact"]': function () {
    Meteor.call('contacts/addToMedialist', this.slug, FlowRouter.getParam('slug'), function (err) {
      if (err) console.error(err)
    })
  }
})
