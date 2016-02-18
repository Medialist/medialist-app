Template.addContact.onCreated(function () {
  this.name = new ReactiveVar('')
  this.autorun(() => {
    this.subscribe('contacts', { name: this.name.get() })
  })
})

Template.addContact.helpers({
  contacts: function () {
    var regex = new RegExp(Template.instance().name.get(), 'gi')
    if (this.ignoreExisting) return []
    var query = {
      name: {
        $regex: regex,
        $options: 'i'
      }
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
    var context = { medialist: FlowRouter.getParam('slug') }
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
  inCurrentMedialist: function () {
    FlowRouter.watchPathChange()
    var medialistSlug = FlowRouter.getParam('slug')
    return this.medialists.indexOf(medialistSlug) > -1
  },
  contactLink: function () {
    FlowRouter.watchPathChange()
    var medialistSlug = FlowRouter.getParam('slug')
    if (this.medialists.indexOf(medialistSlug) > -1) {

    }
  }
})

Template.contactRow.events({
  'click [data-action="add-contact"]': function () {
    Meteor.call('contacts/addToMedialist', this.slug, FlowRouter.getParam('slug'), function (err) {
      if (err) console.error(err)
    })
  },
  'click [data-action="view-contact"]': function () {
    var medialistSlug = FlowRouter.getParam('slug')
    if (this.medialists.indexOf(medialistSlug) > -1) {
      return SlideIns.show('')
    }
    FlowRouter.go('contacts')
    SlideIns.show('')
  }
})
