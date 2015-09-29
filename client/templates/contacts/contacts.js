function makeQuery(term) {
  var query = {}
  if (term) {
    var filterRegExp = new RegExp(term, 'gi')
    query.$or = [
      { 'name': filterRegExp },
      { 'roles.0.title': filterRegExp },
      { 'roles.0.org': filterRegExp }
    ]
  }
  return query
}

var allContactsTpl

Template.contacts.onCreated(function () {
  allContactsTpl = this
  this.checkSelect = new ReactiveVar({})
  this.subscribe('contacts', {limit: 100})
  this.filterTerm = new ReactiveVar()
  this.query = new ReactiveVar()
  this.autorun(() => {
    this.query.set(makeQuery(this.filterTerm.get()))
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
    Modal.show('addContact', { ignoreExisting: true })
  },
  'keyup [data-field="filter-term"]': function (evt, tpl) {
    var filterTerm = tpl.$(evt.currentTarget).val()
    Template.instance().filterTerm.set(filterTerm)
  },
  'click [data-checkbox-all]': function (evt, tpl) {
    var checked = !tpl.$(evt.currentTarget).prev('input').prop('checked')
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
  },
  'click [data-action="create-new-medialist"]': function (evt, tpl) {
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
    Modal.show('selectMedialist', { callback: cb })
  }
})

Template.allContactsRow.helpers({
  checked: function () {
    return this.slug in allContactsTpl.checkSelect.get()
  }
})
