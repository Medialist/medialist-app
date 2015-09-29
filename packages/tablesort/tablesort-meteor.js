MeteorTablesort = function (el, refreshFn) {
  var el = $(el)[0]
  var meteorTablesort = { el, refreshFn }
  Meteor.setTimeout(() => {
    Tracker.afterFlush(() => {
      meteorTablesort.tablesort = new Tablesort(el)
    })
  }, 1)
  if (meteorTablesort.refreshFn) {
    var parent = Template.instance() || Tracker
    parent.autorun((comp) => {
      meteorTablesort.comp = comp
      meteorTablesort.refreshFn()
      if (comp.firstRun) return
      Meteor.setTimeout(() => {
        Tracker.afterFlush(() => {
          meteorTablesort.tablesort.refresh()
        })
      }, 1)
    })
  }
  return meteorTablesort
}
