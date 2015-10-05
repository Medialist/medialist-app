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
  subTemplate() {
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
  // medialistSlug: function () {
  //   return slideIn.medialistSlug.get()
  // },
  // medialistSlugPosts: function () {
  //   return slideIn.medialistSlugPosts.get()
  // },
  // posts: function () {
  //   var query = { 'contacts.slug': this.slug }
  //   var medialist = slideIn.medialistSlugPosts.get()
  //   if (medialist) {
  //     query.medialists = medialist
  //   }
  //   return Posts.find(query, {
  //     sort: { createdAt: -1 },
  //     limit: 10
  //   })
  // }
})

Template.contactActivity.events({
  'click [data-option]': function (evt, tpl) {
    tpl.option.set(tpl.$(evt.currentTarget).data('option'))
  },
  // 'click [data-medialist-slug-log]': function (evt, tpl) {
  //   var medialist = tpl.$(evt.currentTarget).data('medialist-slug-log')
  //   slideIn.medialistSlug.set(medialist)
  // },
  // 'click [data-medialist-slug-posts]': function (evt, tpl) {
  //   var medialist = tpl.$(evt.currentTarget).data('medialist-slug-posts')
  //   slideIn.medialistSlugPosts.set(medialist)
  // },
  // 'click [data-status]': function (evt, tpl) {
  //   var status = tpl.$(evt.currentTarget).data('status')
  //   var medialist = slideIn.medialistSlug.get()
  //   var contact = tpl.data.slug
  //   var message = tpl.$('[data-field="message"]').val()
  //   if (!message) return
  //   Meteor.call('posts/create', {
  //     contactSlug: contact,
  //     medialistSlug: medialist,
  //     message: message,
  //     status: status
  //   }, function (err) {
  //     if (err) return console.error(err)
  //     tpl.$('[data-field="message"]').val('')
  //     slideIn.option.set(null)
  //     slideIn.medialistSlug.set(FlowRouter.getParam('slug'))
  //   })
  // }
})

Template.contactPosts.onCreated(function () {
  this.limit = new ReactiveVar(20)
  this.postOpen = new ReactiveVar(false)
  var medialist = Medialists.findOne({ slug: FlowRouter.getParam('slug') })
  this.status = new ReactiveVar(medialist && medialist.contacts[Template.currentData().contact.slug])
  this.autorun(() => {
    var data = Template.currentData()
    var medialist = data.medialist
    var contact = data.contact.slug
    var limit = this.limit.get()
    var opts = { contact, limit }
    if (medialist) opts.medialist = medialist
    Meteor.subscribe('posts', opts)
  })
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
  'click [data-field="post-text"]' (evt, tpl) {
    tpl.postOpen.set(true)
    Tracker.afterFlush(() => {
      tpl.$('[contenteditable=true]').focus()
    })
  },
  'click .signature' (evt, tpl) { tpl.$('[data-field="post-text"] [contenteditable=true]').focus() },
  'click [data-action="set-status"]' (evt, tpl) { tpl.status.set(this) }
})
