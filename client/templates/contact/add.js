var name = new ReactiveVar()

Template.addContact.helpers({
  contacts: function () {
    return Contacts.find()
  },
  name: function () {
    return name.get()
  }
});

Template.addContact.events({
  'keyup [data-field="contact-name"]': function (evt, tpl) {
    name.set(tpl.$(evt.currentTarget).val())
  },
  'click [data-action="create-contact"]': function () {
    Modal.show('createContact', {
      name: name.get(),
      medialist: FlowRouter.getParam('slug')
    })
    name.set(null)
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
