var ROWS_LIMIT = 25

Template.contactsImport.onCreated(function () {
  var tpl = this

  tpl.file = new ReactiveVar()
  tpl.rows = new ReactiveVar([])
  tpl.parsing = new ReactiveVar(false)
  tpl.header = new ReactiveVar(true)
  tpl.columns = new ReactiveVar()

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

  rowsMessage: () => {
    var file = Template.instance().file.get()
    var parsing = Template.instance().parsing.get()
    var rows = Template.instance().rows.get()

    if (!file || parsing) return ''
    if (rows.length < ROWS_LIMIT) return `${rows.length} contacts`
    return `Showing ${ROWS_LIMIT} of ${rows.length} contacts`
  }
})

Template.contactsImport.events({
  'change [data-action="toggle-csv-header"]': (e, tpl) => {
    tpl.header.set($(e.currentTarget).is(':checked'))
  },

  'click [data-action="import"]': (e, tpl) => {
    var rows = tpl.rows.get()

    if (tpl.header.get()) {
      rows = rows.slice(1)
    }

    var contacts = ContactsImport.createContacts(tpl.columns.get(), rows)

    return console.log(contacts)

    Meteor.call('contacts/import', contacts, err => {

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
  limitRows: rows => rows.slice(0, ROWS_LIMIT),

  // Skip the first row if it is the header row
  skipRow: (row, rows, header) => header && rows[0] === row,

  // Generate all the possible fields from the fields in ImportSchemaDetectors
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
