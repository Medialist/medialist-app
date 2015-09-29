MeteorTablesort = function (el, refreshFunc) {
  var el = $(el)[0]
  var ts = { el, refreshFunc }
  Meteor.setTimeout(() => {
    Tracker.afterFlush(() => {
      ts.tablesort = new Tablesort(el)
    })
  }, 1)
  if (ts.refreshFunc) {
    var parent = Template.instance() || Tracker
    parent.autorun((comp) => {
      ts.comp = comp
      refreshFunc()
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
