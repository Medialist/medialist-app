Template.medialists.onCreated(function () {
  this.filterTerm = new ReactiveVar()
  this.checkSelect = new ReactiveVar({})
  this.query = new ReactiveVar({})
  this.autorun(() => {
    var filterTerm = Template.instance().filterTerm.get()
    var query = {}
    if (filterTerm) {
      var filterRegExp = new RegExp(filterTerm, 'gi')
      query.$or = [
        { 'name': filterRegExp },
        { 'purpose': filterRegExp }
      ]
    }
    this.query.set(query)
  })
  this.subscribe('medialists')
})

Template.medialists.onRendered(function () {
  var tpl = this
  this.tablesort = MeteorTablesort('.medialist-table', {
    collection: Medialists,
    query: () => tpl.query.get()
  })
})

Template.medialists.helpers({
  medialists: function () {
    return Medialists.find(Template.instance().query.get(), {sort: {updatedAt: -1}}).fetch()
  },
  filterTerm: function () {
    return Template.instance().filterTerm.get()
  },
  checkSelectKeys: function () {
    return Object.keys(Template.instance().checkSelect.get())
  },
  checked: function () {
    return this.slug in Template.instance().checkSelect.get()
  }
})

Template.medialists.events({
  'click [data-action="create-medialist"]': function () {
    Modal.show('createMedialist')
  },
  'keyup [data-field="filter-term"]': function (evt, tpl) {
    var filterTerm = tpl.$(evt.currentTarget).val()
    Template.instance().filterTerm.set(filterTerm)
  },
  'click [data-checkbox-all]': function (evt, tpl) {
    var checked = !tpl.$(evt.currentTarget).prev('input').prop('checked')
    if (checked) {
      tpl.checkSelect.set(_.reduce(Medialists.find(tpl.query.get()).fetch(), function (newCheckSelect, contact) {
        newCheckSelect[contact.slug] = true
        return newCheckSelect
      }, {}))
    } else {
      tpl.checkSelect.set({})
    }
  },
  'click [data-checkbox]': function (evt, tpl) {
    App.toggleReactiveObject(tpl.checkSelect, this.slug)
  }
})
