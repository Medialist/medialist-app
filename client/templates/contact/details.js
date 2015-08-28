var contactSection = new ReactiveVar('contactDetails')
var medialistSlug = new ReactiveVar()
var option = new ReactiveVar()

Template.contactSlideIn.helpers({
  contactSection: function () {
    return contactSection.get()
  }
})

Template.contactSlideIn.events({
  'click [data-action="close-contact-slide-in"]': function () {
    SlideIns.hide('right')
  },
  'click [data-section]': function (evt, tpl) {
    var section = tpl.$(evt.currentTarget).data('section')
    contactSection.set(section)
  }
})

Template.contactActivity.onCreated(function () {
  this.subscribe('postsByContact', this.data.slug)
})

Template.contactActivity.onRendered(function () {
  medialistSlug.set(FlowRouter.getParam('slug') || Object.keys(this.data.medialists)[0])
})

Template.contactActivity.helpers({
  option: function () {
    return option.get()
  },
  medialistSlug: function () {
    return medialistSlug.get()
  },
  posts: function () {
    return Posts.find({
      contacts: this.slug
    }, {
      sort: { createdAt: -1 },
      limit: 10
    })
  }
})

Template.contactActivity.events({
  'click [data-option]': function (evt, tpl) {
    option.set(tpl.$(evt.currentTarget).data('option'))
  },
  'click [data-medialist-slug]': function (evt, tpl) {
    var medialist = tpl.$(evt.currentTarget).data('medialist-slug')
    medialistSlug.set(medialist)
  },
  'click [data-status]': function (evt, tpl) {
    var status = tpl.$(evt.currentTarget).data('status')
    var medialist = medialistSlug.get()
    var contact = tpl.data.slug
    var message = tpl.$('[data-field="message"]').val()
    if (!message) return
    Meteor.call('posts/create', contact, medialist, message, status, function (err) {
      if (err) console.error(err)
    })
  }
})
