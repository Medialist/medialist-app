var contactSection = new ReactiveVar('contactDetails')
var medialistSlug = new ReactiveVar()

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

Template.contactActivity.onRendered(function () {
  medialistSlug.set(FlowRouter.getParam('slug') || Object.keys(this.data.medialists)[0])
})

Template.contactActivity.helpers({
  medialistSlug: function () {
    return medialistSlug.get()
  },
  statuses: function () {
    return _.values(Contacts.status)
  },
})

Template.contactActivity.events({
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
    Meteor.call('posts/create', contact, medialist, message, status, function (err, res) {
      if (err) console.error(err)
      console.log(res)
    })
  }
})
