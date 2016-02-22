var slideIn

Template.contactSlideIn.onCreated(function () {
  slideIn = this
  this.contactSection = new ReactiveVar('contactDetails')
  this.medialistSlug = new ReactiveVar()
  this.medialistSlugPosts = new ReactiveVar()
})

Template.contactSlideIn.helpers({
  contactDetails: function () {
    return Contacts.findOne({ slug: this.contact }, { transform: null })
  },
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
  },
  'dblclick [data-action="toggle-phone-type"]': function () {
    Meteor.call('contacts/togglePhoneType', this.slug, err => {
      if (err) return console.error(err)
    })
  }
})

Template.contactActivity.onCreated(function () {
  var tpl = this
  tpl.option = new ReactiveVar('')
  tpl.autorun(function () {
    var data = Template.currentData()
    var opts = {
      medialist: slideIn.medialistSlugPosts.get(),
      contact: data && data.slug,
      limit: 10
    }
    tpl.subscribe('posts', opts)
  })
  tpl.autorun(function () {
    FlowRouter.watchPathChange()
    slideIn.medialistSlugPosts.set(FlowRouter.getParam('medialistSlug'))
  })
})

Template.contactActivity.onRendered(function () {
  slideIn.medialistSlug.set(FlowRouter.getParam('medialistSlug') || this.data.medialists[0])
})

Template.contactActivity.helpers({
  feedbackTemplate() {
    var tpl = Template.instance()
    return {
      template: 'contactPosts',
      data: {
        contact: this,
        medialist: tpl.option.get()
      }
    }
  }
})

Template.contactActivity.events({
  'click [data-option]': function (evt, tpl) {
    tpl.option.set(tpl.$(evt.currentTarget).data('option'))
  },
})

Template.contactPosts.onCreated(function () {
  this.limit = new ReactiveVar(Posts.feedLimit.initial)
  this.spinner = new ReactiveVar(false)
  var medialist = Medialists.findOne({ slug: FlowRouter.getParam('medialistSlug') })
  this.status = new ReactiveVar(medialist && medialist.contacts[Template.currentData().contact.slug])
  // reset form when the medialist or contact slug is changed
  this.autorun(() => {
    var data = Template.currentData()
    var medialist = Medialists.findOne({ slug: data.medialist })
    this.status.set(medialist && medialist.contacts[data.contact.slug])
    this.limit.set(Posts.feedLimit.initial)
  })
  // resubscribe to posts when the parameters change
  this.autorun(() => {
    var data = Template.currentData()
    var medialist = data.medialist
    var contact = data.contact.slug
    var limit = this.limit.get()
    var opts = { contact, limit, types: ['feedback', 'medialists changed', 'need-to-knows'] }
    if (medialist) opts.medialist = medialist
    this.spinner.set(true)
    Meteor.subscribe('posts', opts, () => {
      this.spinner.set(false)
      Tracker.afterFlush(() => $('.info-activity-log').perfectScrollbar('update'))
    })
  })
})

Template.contactPosts.onRendered(function () {
  var data = Template.currentData()
  Meteor.setTimeout(() => Tracker.afterFlush(() => $('.info-activity-log').perfectScrollbar()), 1)
  var incrementLimit = _.debounce(() => {
    // check if there are going to be any more results coming
    var query = { 'contacts.slug': data.contact.slug }
    var limit = this.limit.get()
    if (data.medialist) query.medialists = data.medialist
    if (Posts.find(query, { reactive: false }).count() >= limit) {
      this.limit.set(limit + Posts.feedLimit.increment)
    }
  }, 500, true)
  $(document).on('ps-y-reach-end', incrementLimit)
})

Template.contactPosts.onDestroyed(function () {
  $('.info-activity-log').perfectScrollbar('destroy')
  $(document).off('ps-y-reach-end')
})

Template.contactPosts.helpers({
  posts () {
    var medialist = this.medialist
    var query = { 'contacts.slug': this.contact.slug }
    if (medialist) {
      query.medialists = medialist
      query.type = { $in: [
        'feedback',
        'need to know',
        'medialists changed'
      ] }
    }
    return Posts.find(query, {
      limit: Template.instance().limit.get(),
      sort: { createdAt: -1 }
    })
  }
})

Template.contactPosts.events({
  'click .contenteditable-container' (evt, tpl) {
    Tracker.afterFlush(() => {
      tpl.$('[data-field="post-text"]').focus()
    })
  },
  'paste [contenteditable=true]' (evt) {
    evt.preventDefault()
    var text = evt.originalEvent.clipboardData.getData('text/plain')
    $(evt.currentTarget).html(text)
  }
})
