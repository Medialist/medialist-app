var ROWS_LIMIT = 25

Template.contactsImport.onCreated(function () {
  var tpl = this

  tpl.file = new ReactiveVar()
  tpl.rows = new ReactiveVar([])
  tpl.parsing = new ReactiveVar(false)
  tpl.header = new ReactiveVar(true)
  tpl.columns = new ReactiveVar()
  tpl.importing = new ReactiveVar(false)

  tpl.autorun(parseCsv)

  function parseCsv () {
    var file = tpl.file.get()
    tpl.rows.set([])

    if (!file) return

    tpl.parsing.set(true)

    Papa.parse(file, {
      skipEmptyLines: true,
    	complete: function (results) {
        tpl.parsing.set(false)

        // TODO: snackbar.js
    		if (results.errors && results.errors.length) {
          return console.error(results.errors)
        }

        tpl.rows.set(results.data)

        var unknown = {key: '', label: 'Ignore'}
        var columns = (results.data[0] || []).map(row => (determineSchemaField(row) || unknown))

        tpl.columns.set(columns)
    	}
    })
  }
})

Template.contactsImport.helpers({
  hasFile: () => !!Template.instance().file.get(),
  isParsing: () => !!Template.instance().parsing.get(),
  isImporting: () => !!Template.instance().importing.get(),

  rowsMessage: () => {
    var file = Template.instance().file.get()
    var parsing = Template.instance().parsing.get()

    if (!file || parsing) return ''

    var header = Template.instance().header.get()
    var rows = Template.instance().rows.get()
    var total = rows.length

    if (header) total--
    if (total < 0) total = 0

    if (total < ROWS_LIMIT) return `${total} contacts`
    return `Showing ${ROWS_LIMIT} of ${total} contacts`
  }
})

Template.contactsImport.events({
  'change [data-action="toggle-csv-header"]': (e, tpl) => {
    tpl.header.set($(e.currentTarget).is(':checked'))
  },

  'click [data-action="import"]': (e, tpl) => {
    tpl.importing.set(true)

    var rows = tpl.rows.get()

    if (tpl.header.get()) {
      rows = rows.slice(1)
    }

    var contacts = ContactsImport.createContacts(tpl.columns.get(), rows)

    Meteor.call('contacts/import', contacts, (err, res) => {
      tpl.importing.set(false)
      // TODO: snackbar
      if (err) return console.error('Failed to import contacts', err)

      // TODO: snackbar
      if (res.updated) {
        alert(`${res.created} contacts created, ${res.updated} contacts updated`)
      } else {
        alert(`${res.created} contacts created`)
      }

      FlowRouter.go('/contacts')
    })
  },

  'click [data-action="cancel"]': (e, tpl) => {
    Template.instance().file.set(null)
  }
})

Template.contactsImportChoose.onRendered(function () {
  var tpl = this

  tpl.removeDragDrop = DragDrop(tpl.$('.drop-target')[0], {
    onDrop: files => tpl.data.file.set(files[0]),
    onDragOver: () => tpl.$('.drop-target').addClass('over'),
    onDragLeave: () => tpl.$('.drop-target').removeClass('over')
  })
})

Template.contactsImportChoose.events({
  'change input[type="file"]': (e, tpl) => tpl.data.file.set(e.currentTarget.files[0])
})

Template.contactsImportChoose.onDestroyed(function () {
  this.removeDragDrop()
})

Template.contactsImportPreview.helpers({
  limitRows: (rows, header) => rows.slice(header ? 1 : 0, ROWS_LIMIT),

  // Generate all the possible fields from the fields in ContactsImport.schemaDetectors
  fields: (() => {
    var fields = ContactsImport.schemaDetectors.map(d => d.field).sort((a, b) => {
      if (a.label < b.label) return -1
      if (a.label > b.label) return 1
      return 0
    })
    return () => fields
  })()
})

Template.contactsImportPreview.events({
  'click [data-action="change-field"]' (e, tpl) {
    var item = $(e.currentTarget)
    var index = parseInt(item.attr('data-index'), 10)
    var key = item.attr('data-key')
    var label = item.text()
    var columns = tpl.data.columns.get()

    columns[index] = {key, label}
    tpl.data.columns.set(columns)
  }
})

function determineSchemaField (value) {
  if (!value) return null
  value = `${value}`.trim().toLowerCase()
  var detector = ContactsImport.schemaDetectors.find(d => d.test(value))
  return detector ? detector.field : null
}
