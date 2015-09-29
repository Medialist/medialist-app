MeteorTablesort = function (el, refresh) {
  var el = $(el)[0]
  var meteorTablesort = { el, refresh }
  Meteor.setTimeout(() => {
    Tracker.afterFlush(() => {
      meteorTablesort.tablesort = new Tablesort(el)
    })
  }, 1)
  if (meteorTablesort.refresh) {
    var parent = Template.instance() || Tracker
    parent.autorun((comp) => {
      meteorTablesort.comp = comp
      meteorTablesort.refresh()
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
