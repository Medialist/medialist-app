var medialistTpl
var checkSelect = new ReactiveVar({})

Template.medialist.onCreated(function () {
  medialistTpl = this
  medialistTpl.slug = new ReactiveVar()
  medialistTpl.autorun(function () {
    FlowRouter.watchPathChange()
    medialistTpl.slug.set(FlowRouter.getParam('slug'))
  })
  medialistTpl.autorun(function () {
    medialistTpl.subscribe('medialist', medialistTpl.slug.get())
  })
})

Template.medialist.onRendered(function () {
  var el = this.find('.medialist-table')
  Meteor.setTimeout(function () {
    Tracker.afterFlush(function () {
     new Tablesort(el)
    })
  }, 1)
})

Template.medialist.helpers({
  medialist: function () {
    return Medialists.findOne({slug: medialistTpl.slug.get()})
  },
  contacts: function () {
    return Contacts.find({ medialists: medialistTpl.slug.get() })
  },
  checkSelectKeys: function () {
    return Object.keys(checkSelect.get())
  }
})

Template.medialist.events({
  'click [data-action="add-new"]': function () {
    Modal.show('addContact')
  },
  'click [data-checkbox]': function () {
    App.toggleReactiveObject(checkSelect, this.slug)
  }
})

Template.medialistContactRow.onCreated(function () {
  var opts = {
    medialist: medialistTpl.slug.get(),
    contact: this.data.slug,
    message: true,
    limit:1
  }
  this.subscribe('posts', opts)
})

Template.medialistContactRow.helpers({
  status: function () {
    var medialist = Medialists.findOne({ slug: medialistTpl.slug.get() })
    return medialist && medialist.contacts[this.slug]
  },
  statusIndex: function (status) {
    return Contacts.statusIndex(status)
  },
  latestFeedback: function () {
    return Posts.findOne({
      medialists: medialistTpl.slug.get(),
      'contacts.slug': this.slug
    }, {
      sort: { createdAt: -1 }
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
    Meteor.call('posts/create', {
      contactSlug: contact,
      medialistSlug: medialist,
      status: status
    }, function (err) {
      if (err) console.error(err)
    })
  }
})
