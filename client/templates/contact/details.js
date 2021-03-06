var slideIn

Template.contactSlideIn.onCreated(function () {
  slideIn = this
  this.contactSection = new ReactiveVar('contactDetails')
  this.medialistSlug = new ReactiveVar()
  this.medialistSlugPosts = new ReactiveVar()
})

Template.contactSlideIn.helpers({
  contactDetails: function () {
    return Contacts.findOne({ slug: this.contact })
  },
  contactSection: function () {
    return slideIn.contactSection.get()
  }
})

Template.contactSlideIn.events({
  'click [data-action="close-contact-slide-in"]': function () {
    FlowRouter.setQueryParams({ contact: null, medialist: null })
    SlideIns.hide('right')
  },
  'click [data-section]': function (evt, tpl) {
    var section = tpl.$(evt.currentTarget).data('section')
    slideIn.contactSection.set(section)
  },
  'dblclick [data-action="toggle-phone-type"]': function () {
    Meteor.call('contacts/togglePhoneType', this.slug, errorReporter)
  }
})

Template.contactDetails.onRendered(function () {
  Tracker.afterFlush(() => this.$('.info-content').perfectScrollbar())
})

Template.contactDetails.onRendered(function () {
  this.$('.info-content').perfectScrollbar('destroy')
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
    Meteor.subscribe('posts', opts, () => {
      Tracker.afterFlush(() => $(this.firstNode).parents('.info-activity-log').perfectScrollbar('update'))
    })
  })
})

Template.contactPosts.onRendered(function () {
  var data = Template.currentData()
  Meteor.setTimeout(() => Tracker.afterFlush(() => $(this.firstNode).parents('.info-activity-log').perfectScrollbar()), 1)
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
  $(this.firstNode).parents('.info-activity-log').perfectScrollbar('destroy')
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

function setLabel (type, evt, tpl) {
  var $item = tpl.$(evt.currentTarget)
  var label = $item.text()
  var index = $item.parents('[data-index]').data('index')
  Meteor.call('contacts/setLabel', tpl.data.slug, type, index, label, errorReporter)
}

function deleteType (type, evt, tpl) {
  var $item = tpl.$(evt.currentTarget)
  var index = $item.parents('[data-index]').data('index')
  var data = tpl.data[type + 's'][index]
  var item = { label: data.label, value: data.value }
  Meteor.call('contacts/deleteType', tpl.data.slug, type, item, errorReporter)
}

Template.contactPhones.events({
  'click [data-action=add-phone]' (evt, tpl) {
    Meteor.call('contacts/addPhone', tpl.data.slug, errorReporter)
  },
  'click [data-action=set-label]' (evt, tpl) {
    setLabel('phone', evt, tpl)
  },
  'click [data-action=delete]' (evt, tpl) {
    deleteType('phone', evt, tpl)
  },
})

Template.contactEmails.events({
  'click [data-action=add-email]' (evt, tpl) {
    Meteor.call('contacts/addEmail', tpl.data.slug, errorReporter)
  },
  'click [data-action=set-label]' (evt, tpl) {
    setLabel('email', evt, tpl)
  },
  'click [data-action=delete]' (evt, tpl) {
    deleteType('email', evt, tpl)
  },
})

Template.contactSocials.events({
  'click [data-action=add-social]' (evt, tpl) {
    Meteor.call('contacts/addSocial', tpl.data.slug, errorReporter)
  },
  'click [data-action=set-label]' (evt, tpl) {
    setLabel('social', evt, tpl)
  },
  'click [data-action=delete]' (evt, tpl) {
    deleteType('social', evt, tpl)
  },
})

Template.contactEmails.helpers({
  allOrDefault (arr) {
    if (arr && arr.length) return arr
    return [{ label: 'Work', value: ''}]
  }
})

Template.contactPhones.helpers({
  allOrDefault (arr) {
    if (arr && arr.length) return arr
    return [{ label: 'Mobile', value: ''}]
  }
})

Template.contactSocials.helpers({
  allOrDefault (arr) {
    if (arr && arr.length) return arr
    return [{ label: 'Twitter', value: ''}]
  }
})

function errorReporter (err) {
  if (err) {
    console.error(err)
    Snackbar.error(err.reason || err.error || 'Sorry, there was a problem.')
  }
}
