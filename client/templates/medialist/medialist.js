var medialistTpl

Template.medialist.onCreated(function () {
  medialistTpl = this
  medialistTpl.slug = new ReactiveVar()
  medialistTpl.autorun(function () {
    FlowRouter.watchPathChange()
    medialistTpl.slug.set(FlowRouter.getParam('slug'))
  })
  tpl.subscribe('medialist', tpl.slug.get())
})

Template.medialist.helpers({
  medialist: function () {
    return Medialists.findOne({slug: medialistTpl.slug.get()})
  },
  contacts: function () {
    var query = {}
    query['medialists.' + medialistTpl.slug.get()] = { $exists: true }
    return Contacts.find(query)
  }
})

Template.medialist.events({
  'click [data-action="add-new"]': function () {
    Modal.show('addContact')
  }
})

Template.medialistContactRow.onCreated(function () {
  this.subscribe('posts', medialistTpl.slug.get(), this.data.slug, 1, true)
})

Template.medialistContactRow.helpers({
  contactMedialist: function () {
    return this.medialists[medialistTpl.slug.get()]
  },
  latestFeedback: function () {
    return Posts.findOne({
      medialists: medialistTpl.slug.get(),
      contacts: this.slug
    })
  }
})

Template.medialistContactRow.events({
  'click [data-action="show-contact-slide-in"]': function (evt, tpl) {
    var $el = tpl.$(evt.target)
    if (!$el.parents('[data-field="status"]').length) {
      SlideIns.show('right', 'contactSlideIn', { contact: this })
    }
  },
  'click [data-status]': function (evt, tpl) {
    var status = tpl.$(evt.currentTarget).data('status')
    var contact = tpl.data.slug
    var medialist = medialistTpl.slug.get()
    Meteor.call('posts/create', contact, medialist, null, status, function (err) {
      if (err) console.error(err)
    })
  }
})
