SlideIns = {
  left: {
    template: new ReactiveVar('content-one'),
    data: new ReactiveVar({}),
    open: false
  },
  right: {
    template: new ReactiveVar('content-two'),
    data: new ReactiveVar({}),
    open: false
  },
  show: function (dir, template, data) {
    if (!dir) return
    var slideObj = SlideIns[dir]
    if (!slideObj) return console.error('Bad slideIn direction: ' + dir)

    var changeTemplateAndShow = function() {
      if (data) slideObj.data.set(data)
      if (template) slideObj.template.set(template)
      Tracker.afterFlush(function () {
        $('.slide-in.' + dir).addClass('open')
      })
    }

    if (slideObj.open && slideObj.template.get() !== template) {
      $('.slide-in.' + dir).removeClass('open')
      Meteor.setTimeout(function () {
        changeTemplateAndShow()
      }, 250)
    } else {
      changeTemplateAndShow()
    }
    slideObj.open = true
  },
  hide: function (dir) {
    if (!dir) return
    $('.slide-in.' + dir).removeClass('open')
    SlideIns[dir].open = false
  }
}

Template.slideIn.helpers({
  template: function() {
    return SlideIns[this.dir].template.get()
  },
  data: function() {
    return SlideIns[this.dir].data.get()
  }
})

Template.slideIn.events({
  'click [data-action="hide-slideIn"]': function (evt, tpl) {
    SlideIns.hide(tpl.data.dir)
  }
})
