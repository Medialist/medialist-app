var contactSection = new ReactiveVar('contactDetails')
var medialistSlugLog = new ReactiveVar()
var medialistSlugPosts = new ReactiveVar()
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
  var tpl = this
  tpl.autorun(function () {
    var opts = {
      medialist: medialistSlugPosts.get(),
      contact: Template.currentData().slug,
      limit: 10
    }
    tpl.subscribe('posts', opts)
  })
  tpl.autorun(function () {
    FlowRouter.watchPathChange()
    medialistSlugPosts.set(FlowRouter.getParam('slug'))
  })
})

Template.contactActivity.onRendered(function () {
  medialistSlugLog.set(FlowRouter.getParam('slug') || this.data.medialists[0])
})

Template.contactActivity.helpers({
  option: function () {
    return option.get()
  },
  medialistSlugLog: function () {
    return medialistSlugLog.get()
  },
  medialistSlugPosts: function () {
    return medialistSlugPosts.get()
  },
  posts: function () {
    var query = { contacts: this.slug }
    var medialist = medialistSlugPosts.get()
    if (medialist) {
      query.medialists = medialist
    }
    return Posts.find(query, {
      sort: { createdAt: -1 },
      limit: 10
    })
  }
})

Template.contactActivity.events({
  'click [data-option]': function (evt, tpl) {
    option.set(tpl.$(evt.currentTarget).data('option'))
  },
  'click [data-medialist-slug-log]': function (evt, tpl) {
    var medialist = tpl.$(evt.currentTarget).data('medialist-slug-log')
    medialistSlugLog.set(medialist)
  },
  'click [data-medialist-slug-posts]': function (evt, tpl) {
    var medialist = tpl.$(evt.currentTarget).data('medialist-slug-posts')
    medialistSlugPosts.set(medialist)
  },
  'click [data-status]': function (evt, tpl) {
    var status = tpl.$(evt.currentTarget).data('status')
    var medialist = medialistSlugLog.get()
    var contact = tpl.data.slug
    var message = tpl.$('[data-field="message"]').val()
    if (!message) return
    Meteor.call('posts/create', {
      contactSlug: contact,
      medialistSlug: medialist,
      message: message, 
      status: status
    }, function (err) {
      if (err) return console.error(err)
      tpl.$('[data-field="message"]').val('')
    })
  }
})
