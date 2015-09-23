Template.selectMedialist.helpers({
  medialists: function () {
    return Medialists.find({}, { sort: { name: 1 } })
  }
})

Template.selectMedialist.events({
  'click [data-medialist]': function () {
    var callback = Template.currentData().callback
    callback && callback(this.slug)
  }
})
