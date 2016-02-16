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

    console.log('parsing file', file)

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
  hasFile: () => !!Template.instance().file.get(),
  hasRows: () => !!Template.instance().rows.get().length
})

Template.contactsImport.events({
  'change [data-action="toggle-csv-header"]': (e, tpl) => {
    tpl.header.set($(e.currentTarget).is(':checked'))
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

// Detect the field from the passed values (which could be a header or a value)
var SchemaDetectors = [
  {
    field: {key: 'email', label: 'Email'},
    test: value => {
      if (s.startsWith(value, 'email')) return true
      if (s.startsWith(value, 'e-mail')) return true
      return value.indexOf('@') > 0
    }
  },
  {
    field: {key: 'twitter', label: 'Twitter'},
    test: value => {
      if (s.startsWith(value, 'twitter')) return true
      if (s.include(value, 'twitter.com')) return true
      return s.startsWith(value, '@')
    }
  },
  {
    field: {key: 'facebook', label: 'Facebook'},
    test: (value) => {
      if (s.startsWith(value, 'facebook')) return true
      if (s.include(value, 'facebook.com')) return true
      return false
    }
  },
  {
    field: {key: 'mobile', label: 'Mobile'},
    test: (value) => {
      if (s.startsWith(value, 'mobile')) return true
      if (s.startsWith(value, 'cell')) return true

      if (/^[0-9 -+()]+$/.test(value)) {
        // Is mobile if remove all non numerics and it starts with 07
        return _.startsWith(value.replace(/[^0-9]/g, ''), '07')
      }

      return false
    }
  },
  {
    field: {key: 'landline', label: 'Telephone'},
    test: (value) => {
      if (s.startsWith(value, 'telephone')) return true
      if (s.startsWith(value, 'phone')) return true
      if (s.startsWith(value, '+44')) return true
      return /^[0-9 -+()]+$/.test(value)
    }
  }
]

function determineSchemaField (value) {
  if (!value) return null
  value = `${value}`.trim().toLowerCase()
  var detector = SchemaDetectors.find(d => d.test(value))
  return detector ? detector.field : null
}
