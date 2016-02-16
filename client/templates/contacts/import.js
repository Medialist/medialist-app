Template.contactsImport.onCreated(function () {
  var tpl = this

  tpl.file = new ReactiveVar()
  tpl.rows = new ReactiveVar([])
  tpl.parsing = new ReactiveVar(false)
  tpl.header = new ReactiveVar(true)

  tpl.autorun(parseCsv)

  function parseCsv () {
    var file = tpl.file.get()
    tpl.rows.set([])

    if (!file) return

    tpl.parsing.set(true)

    Papa.parse(file, {
    	complete: function (results) {
        tpl.parsing.set(false)

        // TODO: snackbar.js
    		if (results.errors && results.errors.length) {
          return console.error(results.errors)
        }

        console.log(results)
        tpl.rows.set(results.data)
    	}
    })
  }
})

Template.contactsImport.helpers({
  hasFile: () => !!Template.instance().file.get()
})

Template.contactsImport.events({
  'change [data-action="toggle-csv-header"]': (e, tpl) => {
    tpl.header.set($(e.currentTarget).is(':checked'))
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
  columns (rows) {
    if (!rows || !rows.length) return []
    var unknown = {key: '', label: 'Unknown'}
    return rows[0].map(row => (determineSchemaField(row) || unknown))
  },
  // Skip the first row if it is the header row
  skipRow: (row, rows, header) => header && rows[0] === row
})

function determineSchemaField (value) {
  if (!value) return null
  value = `${value}`.trim().toLowerCase()
  var detector = ImportSchemaDetectors.find(d => d.test(value))
  return detector ? detector.field : null
}
