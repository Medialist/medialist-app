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
    App.breadcrumbs.set([
      {
        text: 'Medialists',
        route: 'dashboard'
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
    Meteor.setTimeout(function () {
       SlideIns.show('left', 'mainmenu')
    }, 1)
  },
  triggersExit: [function () {
    SlideIns.hide('left')
  }]
})
