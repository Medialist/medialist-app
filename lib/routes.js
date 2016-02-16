// ******************* GLOBAL SETTINGS *****************************

// UTILITY FUNCTIONS

function ensureSignedIn (context, redirect) {
  if (!Meteor.userId() && !Meteor.loggingIn()) {
    redirect('/')
  }
}

function dashboardIfSignedIn (context, redirect) {
  if (Meteor.userId()) {
    redirect('/dashboard')
  }
}

function hideSlideIns () {
  SlideIns.hide('left')
  SlideIns.hide('right')
}

function showMenuSlideIn () {
  Meteor.setTimeout(function () {
     SlideIns.show('left', 'mainmenu')
  }, 1)
  SlideIns.hide('right')
}

// TRIGGERS

FlowRouter.triggers.enter([ hideSlideIns ], { except: ['dashboard'] })

// GROUPS

var publicRoutes = FlowRouter.group({
  name: 'public',
  triggersEnter: [dashboardIfSignedIn]
})
var loggedInRoutes = FlowRouter.group({
  name: 'loggedIn',
  triggersEnter: [ensureSignedIn]
})

// ************************* ROUTES ********************************

publicRoutes.route('/', {
  name: 'home',
  action: function () {
    App.breadcrumbs.set([
      {
        text: 'Home',
        route: 'home'
      }
    ])
    BlazeLayout.render('Layout', {main: 'home'})
  }
})
publicRoutes.route('/components', {
  name: 'components',
  action: function() {
    App.breadcrumbs.set([
      {
        text: 'Components',
        route: 'components'
      }
    ])
    BlazeLayout.render('Layout', {main: 'components'})
  }
})

loggedInRoutes.route('/medialist/:slug', {
  name: 'medialist',
  action: function(params) {
    var safeSlug = App.cleanSlug(params.slug)
    if (params.slug !== safeSlug) FlowRouter.setParams({ slug: safeSlug })
    App.breadcrumbs.set([
      {
        text: 'Medialists',
        route: 'medialists'
      },
      {
        text: '#' + params.slug,
        route: 'medialist',
        params: params
      }
    ])
    BlazeLayout.render('Layout', {main: 'medialist'})
  }
})

loggedInRoutes.route('/medialists', {
  name: 'medialists',
  action: function(params, queryParams) {
    App.breadcrumbs.set([
      {
        text: 'Medialists',
        route: 'medialists'
      }
    ])
    BlazeLayout.render('Layout', {main: 'medialists'})
  }
});

loggedInRoutes.route('/dashboard', {
  name: 'dashboard',
  action: function() {
    App.breadcrumbs.set([
      {
        text: 'Dashboard',
        route: 'dashboard'
      }
    ])
    BlazeLayout.render('Layout', {main: 'dashboard'})
  }
})

loggedInRoutes.route('/contacts', {
  name: 'contacts',
  action: function () {
    App.breadcrumbs.set([
      {
        text: 'Contacts',
        route: 'contacts'
      }
    ])
    BlazeLayout.render('Layout', {main: 'contacts'})
  }
});
