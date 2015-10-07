var slideIn

Template.contactSlideIn.onCreated(function () {
  slideIn = this
  this.contactSection = new ReactiveVar('contactDetails')
  this.medialistSlug = new ReactiveVar()
  this.medialistSlugPosts = new ReactiveVar()
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
  tpl.option = new ReactiveVar('all')
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
  slideIn.medialistSlug.set(FlowRouter.getParam('slug') || this.data.medialists[0])
})

Template.contactActivity.helpers({
  feedbackTemplate() {
    var tpl = Template.instance()
    switch (tpl.option.get()) {
      case 'all':
        return {
          template: 'contactPosts',
          data: {
            contact: this
          }
        }
        break
      case 'medialist':
        return {
          template: 'contactPosts',
          data: {
            contact: this,
            medialist: FlowRouter.getParam('slug')
          }
        }
        break
      case 'needToKnow':
        return {
          template: 'contactNeedToKnows',
          data: {
            contact: this
          }
        }
        break
    }
  }
})

Template.contactActivity.events({
  'click [data-option]': function (evt, tpl) {
    tpl.option.set(tpl.$(evt.currentTarget).data('option'))
  },
})

Template.contactPosts.onCreated(function () {
  this.limit = new ReactiveVar(5)
  this.postOpen = new ReactiveVar(false)
  var medialist = Medialists.findOne({ slug: FlowRouter.getParam('slug') })
  this.status = new ReactiveVar(medialist && medialist.contacts[Template.currentData().contact.slug])
  // reset form when the medialist or contact slug is changed
  this.autorun(() => {
    var data = Template.currentData()
    var medialist = data.medialist
    this.limit.set(5)
    this.postOpen.set(false)
    var medialist = Medialists.findOne({ slug: FlowRouter.getParam('slug') })
    this.status.set(medialist && medialist.contacts[Template.currentData().contact.slug])
  })
  // resubscribe to posts when the parameters change
  this.autorun(() => {
    var data = Template.currentData()
    var medialist = data.medialist
    var contact = data.contact.slug
    var limit = this.limit.get()
    var opts = { contact, limit }
    if (medialist) opts.medialist = medialist
    Meteor.subscribe('posts', opts, () => $('.contact-activity-log').perfectScrollbar('update'))
  })
})

Template.contactPosts.onRendered(function () {
  Meteor.setTimeout(() => Tracker.afterFlush(() => $('.contact-activity-log').perfectScrollbar()), 1)
  var incrementLimit = _.debounce(() => this.limit.set(this.limit.get() + 2, 500, true))
  $(document).on('ps-y-reach-end', incrementLimit)
})

Template.contactPosts.onDestroyed(function () {
  $('.contact-activity-log').perfectScrollbar('destroy')
  $(document).off('ps-y-reach-end')
})

Template.contactPosts.helpers({
  posts () {
    var medialist = this.medialist
    var query = {
      'contacts.slug': this.contact.slug,
    }
    if (medialist) query.medialists = medialist
    return Posts.find(query, {
      limit: Template.instance().limit.get(),
      sort: { createdAt: -1 }
    })
  }
})

Template.contactPosts.events({
  'click .contenteditable-container' (evt, tpl) {
    tpl.postOpen.set(true)
    Tracker.afterFlush(() => {
      tpl.$('[data-field="post-text"]').focus()
    })
  },
  'click .signature' (evt, tpl) { tpl.$('[data-field="post-text"]').focus() },
  'click [data-action="set-status"]' (evt, tpl) { tpl.status.set(this.valueOf()) },
  'click [data-action="save-post"]' (evt, tpl) {
    var status = tpl.status.get()
    var medialist = FlowRouter.getParam('slug')
    var contact = this.contact.slug
    var message = tpl.$('[data-field="post-text"]').html()
    if (!message) return
    Meteor.call('posts/create', {
      contactSlug: contact,
      medialistSlug: medialist,
      message: message,
      status: status
    }, function (err) {
      if (err) return console.error(err)
      tpl.postOpen.set(false)
      $('.contact-activity-log').perfectScrollbar('update')
    })
  }
})

Template.contactNeedToKnows.onCreated(function () {
  this.limit = new ReactiveVar(5)
  this.postOpen = new ReactiveVar(false)
  // reset form when contact slug is changed
  this.autorun(() => {
    Template.currentData()
    this.limit.set(5)
    this.postOpen.set(false)
  })
  // resubscribe to posts when the parameters change
  this.autorun(() => {
    var data = Template.currentData()
    var contact = data.contact.slug
    var limit = this.limit.get()
    var opts = { contact, limit }
    Meteor.subscribe('posts', opts, () => $('.contact-activity-log').perfectScrollbar('update'))
  })
})

Template.contactNeedToKnows.onRendered(function () {
  Meteor.setTimeout(() => Tracker.afterFlush(() => $('.contact-activity-log').perfectScrollbar()), 1)
  var incrementLimit = _.debounce(() => this.limit.set(this.limit.get() + 2, 500, true))
  $(document).on('ps-y-reach-end', incrementLimit)
})

Template.contactNeedToKnows.onDestroyed(function () {
  $('.contact-activity-log').perfectScrollbar('destroy')
  $(document).off('ps-y-reach-end')
})

Template.contactNeedToKnows.helpers({
  posts () {
    var query = {
      'contacts.slug': this.contact.slug,
      'type': 'need to know'
    }
    return Posts.find(query, {
      limit: Template.instance().limit.get(),
      sort: { createdAt: -1 }
    })
  }
})

Template.contactNeedToKnows.events({
  'click .contenteditable-container' (evt, tpl) {
    tpl.postOpen.set(true)
    Tracker.afterFlush(() => {
      tpl.$('[data-field="need-to-know-text"]').focus()
    })
  },
  'click [data-action="save-need-to-know"]' (evt, tpl) {
    var contact = this.contact.slug
    var message = tpl.$('[data-field="need-to-know-text"]').html()
    if (!message) return
    Meteor.call('posts/createNeedToKnow', {
      contactSlug: contact,
      message: message,
    }, function (err) {
      if (err) return console.error(err)
      tpl.postOpen.set(false)
      $('.contact-activity-log').perfectScrollbar('update')
    })
  }
})
