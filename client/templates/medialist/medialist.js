var medialistTpl
var checkSelect = new ReactiveVar({})

Template.medialist.onCreated(function () {
  medialistTpl = this
  medialistTpl.slug = new ReactiveVar()
  medialistTpl.checkSelect = new ReactiveVar({})
  medialistTpl.filterTerm = new ReactiveVar()
  medialistTpl.autorun(function () {
    FlowRouter.watchPathChange()
    medialistTpl.slug.set(FlowRouter.getParam('slug'))
    medialistTpl.filterTerm.set()
  })
  medialistTpl.autorun(function () {
    medialistTpl.checkSelect.set({})
    $('[data-checkbox-all]').prev('input').prop('checked', false)
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
    var filterTerm = Template.instance().filterTerm.get()
    var query = { medialists: medialistTpl.slug.get() }
    if (filterTerm) {
      var filterRegExp = new RegExp(filterTerm, 'gi')
      query.$or = [
        { 'name': filterRegExp },
        { 'roles.0.title': filterRegExp },
        { 'roles.0.org': filterRegExp }
      ]
    }
    return Contacts.find(query)
  },
  filterTerm: function () {
    return Template.instance().filterTerm.get()
  },
  checkSelectKeys: function () {
    return Object.keys(medialistTpl.checkSelect.get())
  }
})

Template.medialist.events({
  'click [data-action="add-new"]': function () {
    Modal.show('addContact')
  },
  'click [data-checkbox-all]': function (evt, tpl) {
    var checked = !tpl.$(evt.currentTarget).prev('input').prop('checked')
    if (checked) {
      medialistTpl.checkSelect.set(_.reduce(Contacts.find({ medialists: medialistTpl.slug.get() }).fetch(), function (newCheckSelect, contact) {
        newCheckSelect[contact.slug] = true
        return newCheckSelect
      }, {}))
    } else {
      medialistTpl.checkSelect.set({})
    }
  },
  'click [data-checkbox]': function () {
    App.toggleReactiveObject(medialistTpl.checkSelect, this.slug)
  },
  'click [data-action="create-new-medialist"]': function () {
    var contactSlugs = _.keys(medialistTpl.checkSelect.get())
    Modal.show('createMedialist', { contacts: contactSlugs })
  },
  'click [data-action="add-to-existing-medialist"]': function () {
    var contactSlugs = _.keys(medialistTpl.checkSelect.get())
    var cb = function (medialistSlug) {
      Meteor.call('contacts/addToMedialist', contactSlugs, medialistSlug, function (err) {
        if (err) return console.log(err)
        Modal.hide()
        FlowRouter.go('medialist', { slug: medialistSlug })
      })
    }
    Modal.show('selectMedialist', { callback: cb })
  },
  'click [data-action="remove-from-medialist"]': function () {
    var contactSlugs = _.keys(medialistTpl.checkSelect.get())
    var medialistSlug = medialistTpl.slug.get()
    Meteor.call('contacts/removeFromMedialist', contactSlugs, medialistSlug, function (err) {
      if (err) return console.log(err)
    })
  },
  'keyup [data-field="filter-term"]': function (evt, tpl) {
    var filterTerm = tpl.$(evt.currentTarget).val()
    Template.instance().filterTerm.set(filterTerm)
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
  },
  checked: function () {
    return this.slug in medialistTpl.checkSelect.get()
  }
})

Template.medialistContactRow.events({
  'click [data-action="show-contact-slide-in"]': function (evt, tpl) {
    var $el = tpl.$(evt.target)
    if (!$el.parents('[data-no-sidebar]').length) {
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
