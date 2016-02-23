Template.addContact.onCreated(function () {
  this.name = new ReactiveVar('')
  this.autorun(() => {
    this.subscribe('contacts', { regex: this.name.get() })
  })
})

Template.addContact.helpers({
  contacts: function () {
    var nameString = Template.instance().name.get()
    if (!nameString) return []
    var regex = new RegExp(nameString, 'gi')
    if (this.ignoreExisting) return []
    var query = {
      $or: [
        { name: regex },
        { jobTitles: regex },
        { primaryOutlets: regex },
        { otherOutlets: regex }
      ]
    }
    return Contacts.find(query, { limit: App.contactSuggestions })
  },
  name: function () {
    return Template.instance().name.get()
  }
});

Template.addContact.events({
  'keyup [data-field="contact-name"]': function (evt, tpl) {
    tpl.name.set(tpl.$(evt.currentTarget).val())
  },
  'submit, click [data-action="create-contact"]': function (evt, tpl) {
    evt.preventDefault()
    var context = { medialist: FlowRouter.getParam('medialistSlug') }
    var identifier = tpl.name.get()
    if (identifier.slice(0, 1) === '@') {
      context.screenName = identifier.slice(1)
    } else {
      context.name = identifier
    }
    tpl.name.set('')
    Modal.show('createContact', context)
  }
});

Template.contactRow.helpers({
  status: function () {
    var medialist = Medialists.findOne(FlowRouter.getParam('medialistSlug'))
    return medialist && medialist.contacts[this.slug]
  },
  inCurrentMedialist: function () {
    FlowRouter.watchPathChange()
    var medialistSlug = FlowRouter.getParam('medialistSlug')
    return this.medialists.indexOf(medialistSlug) > -1
  }
})

Template.contactRow.events({
  'click [data-action="add-contact"]': function () {
    Meteor.call('contacts/addToMedialist', this.slug, FlowRouter.getParam('medialistSlug'), function (err) {
      if (err) console.error(err)
    })
  },
  'click [data-action="view-contact"]': function () {
    Modal.hide()
    var medialistSlug = FlowRouter.getParam('medialistSlug')
    var context = { contact: this.slug }
    if (this.medialists.indexOf(medialistSlug) === -1) return FlowRouter.go('contacts', {}, context)
    FlowRouter.setQueryParams(context)
  }
})
