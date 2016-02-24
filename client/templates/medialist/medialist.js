var medialistTpl

Template.medialist.onCreated(function () {
  medialistTpl = this
  medialistTpl.slug = new ReactiveVar()
  medialistTpl.checkSelect = new ReactiveVar({})
  medialistTpl.filterTerm = new ReactiveVar()
  medialistTpl.query = new ReactiveVar({})
  medialistTpl.autorun(() => {
    var filterTerm = medialistTpl.filterTerm.get()
    var query = { medialists: medialistTpl.slug.get() }
    if (filterTerm) {
      var filterRegExp = new RegExp(filterTerm, 'gi')
      query.$or = [
        { name: filterRegExp },
        { jobTitles: filterRegExp },
        { primaryOutlets: filterRegExp }
      ]
    }
    medialistTpl.query.set(query)
  })
  medialistTpl.autorun(() => {
    FlowRouter.watchPathChange()
    medialistTpl.slug.set(FlowRouter.getParam('medialistSlug'))
    medialistTpl.filterTerm.set()
  })
  medialistTpl.autorun(() => {
    medialistTpl.checkSelect.set({})
    $('[data-checkbox-all]').prop('checked', false)
    medialistTpl.subscribe('medialist', medialistTpl.slug.get())
  })
  medialistTpl.autorun(() => {
    FlowRouter.watchPathChange()
    if (!medialistTpl.subscriptionsReady()) return
    var contactSlug = FlowRouter.getQueryParam('contact')
    if (Contacts.find({ slug: contactSlug }).count()) {
      SlideIns.show('right', 'contactSlideIn', { contact: contactSlug })
      Meteor.setTimeout(() => {
        var contactRow = medialistTpl.$(`[data-contact="${contactSlug}"]`)
        if (!contactRow.visible()) $.scrollTo(contactRow, { offset: -250 })
      }, 1)
    } else {
      SlideIns.hide('right')
    }
  })
})

Template.medialist.onRendered(function () {
  this.tablesort = MeteorTablesort('.medialist-table', () => {
    Contacts.find(this.query.get()).fetch()
  })
})

Template.medialist.helpers({
  medialist: function () {
    return Medialists.findOne({slug: medialistTpl.slug.get()})
  },
  contacts: function () {
    return Contacts.find(Template.instance().query.get())
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
    FlowRouter.setQueryParams({ contact: null, medialist: null })
    Modal.show('addContact')
  },
  'click [data-checkbox-all]': function (evt, tpl) {
    var checked = tpl.$(evt.currentTarget).prop('checked')
    if (checked) {
      medialistTpl.checkSelect.set(_.reduce(Contacts.find(tpl.query.get()).fetch(), function (newCheckSelect, contact) {
        newCheckSelect[contact.slug] = true
        return newCheckSelect
      }, {}))
    } else {
      medialistTpl.checkSelect.set({})
    }
  },
  'click [data-checkbox]': function (evt, tpl) {
    App.toggleReactiveObject(medialistTpl.checkSelect, this.slug)
    if(!$(evt.currentTarget).prop('checked')) $('[data-checkbox-all]').prop('checked', false)
  },
  'click [data-action="create-new-medialist"]': function () {
    FlowRouter.setQueryParams({ contact: null, medialist: null })
    var contactSlugs = _.keys(medialistTpl.checkSelect.get())
    Modal.show('createMedialist', { contacts: contactSlugs })
  },
  'click [data-action="remove-from-medialist"]': function () {
    var contactSlugs = _.keys(medialistTpl.checkSelect.get())
    var medialistSlug = medialistTpl.slug.get()
    Meteor.call('contacts/removeFromMedialist', contactSlugs, medialistSlug, function (err) {
      if (err) return console.log(err)
      medialistTpl.checkSelect.set({})
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
    limit: 1
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
      'contacts.slug': this.slug,
      type: 'feedback',
      message: { $exists: true }
    }, {
      sort: { createdAt: -1 }
    })
  },
  checked: function () {
    return this.slug in medialistTpl.checkSelect.get()
  },
  selectedContacts: function () {
    return _.keys(medialistTpl.checkSelect.get())
  }
})

Template.medialistContactRow.events({
  'click [data-action="show-contact-slide-in"]': function (evt, tpl) {
    var $el = tpl.$(evt.target)
    if (!$el.parents('[data-no-sidebar]').length) {
      FlowRouter.setQueryParams({ contact: this.slug })
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

Template.addToMedialist.onCreated(function () {
  var tpl = this
  tpl.term = new ReactiveVar('')

  tpl.subscribe('medialist-favourites')
  tpl.subscribe('medialists-by-slug', App.getRecentMedialists())
  tpl.autorun(() => {
    var term = tpl.term.get()
    Meteor.subscribe('medialists', {
      regex: term,
      limit: App.medialistSuggestions
    })
  })
})

Template.addToMedialist.helpers({
  searchMedialists: () => {
    var term = Template.instance().term.get()
    if (!term) return []
    return Medialists.search({
      regex: term,
      limit: App.medialistSuggestions
    })
  },
  recentMedialists: () => {
    var recentMedialists = App.getRecentMedialists()
    var medialists = Medialists.find({ slug: { $in: recentMedialists } }).fetch()
    return medialists.sort((m1, m2) => recentMedialists.indexOf(m1.slug) - recentMedialists.indexOf(m2.slug))
  },
  favouriteMedialists: () => {
    return Medialists.find({}, { limit: 5 })
  }
})

Template.addToMedialist.events({
  'keyup [name="medialist-search"]': (evt, tpl) => {
    tpl.term.set($(evt.currentTarget).val())
  },
  'hidden.bs.dropdown .btn-group': (evt, tpl) => {
    tpl.term.set('')
    tpl.$('[name="medialist-search"]').val('')
  },
  'click [data-action="add-to-medialist"]': function (evt, tpl) {
    var medialistSlug = this.slug
    var contactSlugs = tpl.data.selectedContacts
    Meteor.call('contacts/addToMedialist', contactSlugs, medialistSlug, err => {
      if (err) return console.err(err)
      // TODO Add snackbar
      FlowRouter.go('medialist', { slug: medialistSlug })
    })
  }
})
