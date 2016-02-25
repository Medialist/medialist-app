function makeQuery(term) {
  var query = {}
  if (term) {
    var filterRegExp = new RegExp(term, 'gi')
    query.$or = [
      { name: filterRegExp },
      { jobTitles: filterRegExp },
      { primaryOutlets: filterRegExp }
    ]
  }
  return query
}

var allContactsTpl

Template.contacts.onCreated(function () {
  allContactsTpl = this
  allContactsTpl.checkSelect = new ReactiveVar({})
  allContactsTpl.subscribe('contacts')
  allContactsTpl.filterTerm = new ReactiveVar()
  allContactsTpl.query = new ReactiveVar()
  allContactsTpl.autorun(() => {
    allContactsTpl.query.set(makeQuery(allContactsTpl.filterTerm.get()))
  })
  allContactsTpl.autorun(() => {
    FlowRouter.watchPathChange()
    if (!allContactsTpl.subscriptionsReady()) return
    var contactSlug = FlowRouter.getQueryParam('contact')
    if (Contacts.find({ slug: contactSlug }).count()) {
      SlideIns.show('right', 'contactSlideIn', { contact: contactSlug })
      Meteor.setTimeout(() => {
        var contactRow = allContactsTpl.$(`[data-contact="${contactSlug}"]`)
        if (!contactRow.visible()) $.scrollTo(contactRow, { offset: -250 })
      }, 1)
    } else {
      SlideIns.hide('right')
    }
  })
})

Template.contacts.onRendered(function () {
  this.tablesort = MeteorTablesort('.medialist-table', () => {
    Contacts.find(this.query.get()).fetch()
  })
})

Template.contacts.helpers({
  allContacts: function () {
    return Contacts.find(Template.instance().query.get(), {sort: {'roles.[0].org': 1}})
  },
  filterTerm: function () {
    return Template.instance().filterTerm.get()
  },
  checkSelectKeys: function () {
    return Object.keys(Template.instance().checkSelect.get())
  }
})

Template.contacts.events({
  'click [data-action="add-new"]': function () {
    FlowRouter.setQueryParams({ contact: null, medialist: null })
    Modal.show('addContact')
  },
  'keyup [data-field="filter-term"]': function (evt, tpl) {
    var filterTerm = tpl.$(evt.currentTarget).val()
    Template.instance().filterTerm.set(filterTerm)
  },
  'click [data-checkbox-all]': function (evt, tpl) {
    var checked = tpl.$(evt.currentTarget).prop('checked')
    if (checked) {
      var query = tpl.query.get()
      tpl.checkSelect.set(_.reduce(Contacts.find(query).fetch(), function (newCheckSelect, contact) {
        newCheckSelect[contact.slug] = true
        return newCheckSelect
      }, {}))
    } else {
      tpl.checkSelect.set({})
    }
  },
  'click [data-checkbox]': function (evt, tpl) {
    App.toggleReactiveObject(tpl.checkSelect, this.slug)
    if(!$(evt.currentTarget).prop('checked')) $('[data-checkbox-all]').prop('checked', false)
  },
  'click [data-action="create-new-medialist"]': function (evt, tpl) {
    FlowRouter.setQueryParams({ contact: null, medialist: null })
    var contactSlugs = _.keys(tpl.checkSelect.get())
    Modal.show('createMedialist', { contacts: contactSlugs })
  },
  'click [data-action="add-to-existing-medialist"]': function (evt, tpl) {
    var contactSlugs = _.keys(tpl.checkSelect.get())
    var cb = function (medialistSlug) {
      Meteor.call('contacts/addToMedialist', contactSlugs, medialistSlug, function (err) {
        if (err) return console.log(err)
        Modal.hide()
        FlowRouter.go('medialist', { slug: medialistSlug })
      })
    }
    FlowRouter.setQueryParams({ contact: null, medialist: null })
    Modal.show('selectMedialist', { callback: cb })
  }
})

Template.allContactsRow.helpers({
  checked: function () {
    return this.slug in allContactsTpl.checkSelect.get()
  }
})

Template.allContactsRow.events({
  'click [data-action="show-contact-slide-in"]': function (evt, tpl) {
    var $el = tpl.$(evt.target)
    if (!$el.parents('[data-no-sidebar]').length) {
      FlowRouter.setQueryParams({ contact: this.slug })
    }
  }
})
