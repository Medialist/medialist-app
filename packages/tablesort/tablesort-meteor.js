MeteorTablesort = function (el, refreshObj, tpl) {
  var el = $(el)[0]
  var ts = { el, refreshObj }
  Meteor.setTimeout(() => {
    Tracker.afterFlush(() => {
      ts.tablesort = new Tablesort(el)
    })
  }, 1)
  if (ts.refreshObj) {
    var parent = Template.instance() || Tracker
    parent.autorun((comp) => {
      ts.comp = comp
      var query = ts.refreshObj.query ? ts.refreshObj.query() : {}
      var options = ts.refreshObj.options ? ts.refreshObj.options() : {}
      ts.refreshObj.collection.find(query, options).fetch()
      if (comp.firstRun) return
      Meteor.setTimeout(() => {
        Tracker.afterFlush(() => {
          ts.tablesort.refresh()
        })
      }, 1)
    })
  }
  return ts
}
