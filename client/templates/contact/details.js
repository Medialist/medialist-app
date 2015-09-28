var slideIn

Template.contactSlideIn.onCreated(function () {
  slideIn = this
  this.contactSection = new ReactiveVar('contactDetails')
  this.medialistSlugLog = new ReactiveVar()
  this.medialistSlugPosts = new ReactiveVar()
  this.option = new ReactiveVar()
})

Template.contactSlideIn.helpers({
  contactSection: function () {
    return slideIn.contactSection.get()
  }
})

Template.contactSlideIn.events({
  'click [data-action="close-contact-slide-in"]': function () {
    SlideIns.hide('right')
  },
  'click [data-section]': function (evt, tpl) {
    var section = tpl.$(evt.currentTarget).data('section')
    slideIn.contactSection.set(section)
  }
})

Template.contactActivity.onCreated(function () {
  var tpl = this
  tpl.autorun(function () {
    var opts = {
      medialist: slideIn.medialistSlugPosts.get(),
      contact: Template.currentData().slug,
      limit: 10
    }
    tpl.subscribe('posts', opts)
  })
  tpl.autorun(function () {
    FlowRouter.watchPathChange()
    slideIn.medialistSlugPosts.set(FlowRouter.getParam('slug'))
  })
})

Template.contactActivity.onRendered(function () {
  slideIn.medialistSlugLog.set(FlowRouter.getParam('slug') || this.data.medialists[0])
})

Template.contactActivity.helpers({
  option: function () {
    return slideIn.option.get()
  },
  medialistSlugLog: function () {
    return slideIn.medialistSlugLog.get()
  },
  medialistSlugPosts: function () {
    return slideIn.medialistSlugPosts.get()
  },
  posts: function () {
    var query = { 'contacts.slug': this.slug }
    var medialist = slideIn.medialistSlugPosts.get()
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
    slideIn.option.set(tpl.$(evt.currentTarget).data('option'))
  },
  'click [data-medialist-slug-log]': function (evt, tpl) {
    var medialist = tpl.$(evt.currentTarget).data('medialist-slug-log')
    slideIn.medialistSlugLog.set(medialist)
  },
  'click [data-medialist-slug-posts]': function (evt, tpl) {
    var medialist = tpl.$(evt.currentTarget).data('medialist-slug-posts')
    slideIn.medialistSlugPosts.set(medialist)
  },
  'click [data-status]': function (evt, tpl) {
    var status = tpl.$(evt.currentTarget).data('status')
    var medialist = slideIn.medialistSlugLog.get()
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
      slideIn.option.set(null)
      slideIn.medialistSlugLog.set(FlowRouter.getParam('slug'))
    })
  }
})
