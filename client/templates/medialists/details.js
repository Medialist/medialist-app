Template.medialistSlideIn.onCreated(function () {
  var tpl = this
  tpl.section = new ReactiveVar('medialistDetails')
})

Template.medialistSlideIn.helpers({
  medialistDetails () {
    return Medialists.findOne({ slug: this.medialist })
  }
})

Template.medialistSlideIn.events({
  'click [data-section]': function (evt, tpl) {
    var section = tpl.$(evt.currentTarget).data('section')
    tpl.section.set(section)
  },
  'click [data-action="close-medialist-slide-in"]': function () {
    SlideIns.hide('right')
  }
})

Template.medialistActivity.onCreated(function () {
  var tpl = this
  tpl.limit = new ReactiveVar(Posts.feedLimit.initial)
  tpl.spinner = new ReactiveVar(false)
  tpl.autorun(() => {
    var limit = this.limit.get()
    var data = Template.currentData()
    this.spinner.set(true)
    var opts = {
      medialist: data.slug,
      limit: limit,
      types: ['feedback', 'medialists changed', 'need-to-knows']
    }
    tpl.subscribe('posts', opts, () => {
      this.spinner.set(false)
      Tracker.afterFlush(() => $('.info-activity-log').perfectScrollbar('update'))
    })
  })
})

Template.medialistActivity.onRendered(function () {
  var data = Template.currentData()
  Meteor.setTimeout(() => Tracker.afterFlush(() => $('.info-activity-log').perfectScrollbar()), 1)
  var incrementLimit = _.debounce(() => {
    // check if there are going to be any more results coming
    var query = { medialists: data.slug }
    var limit = this.limit.get()
    if (Posts.find(query, { reactive: false }).count() >= limit) {
      this.limit.set(limit + Posts.feedLimit.increment)
    }
  }, 500, true)
  $(document).on('ps-y-reach-end', incrementLimit)
})

Template.medialistActivity.onDestroyed(function () {
  $('.info-activity-log').perfectScrollbar('destroy')
  $(document).off('ps-y-reach-end')
})

Template.medialistActivity.helpers({
  posts () {
    var query = {
      medialists: this.slug
    }
    return Posts.find(query, {
      limit: Template.instance().limit.get(),
      sort: { createdAt: -1 }
    })
  }
})
