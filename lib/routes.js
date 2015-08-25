// ******************* GLOBAL SETTINGS *****************************

// UTILITY FUNCTIONS

function ensureSignedIn () {
  if (!Meteor.userId() && !Meteor.loggingIn()) {
    FlowRouter.go('home')
  }
}

function dashboardIfSignedIn () {
  if (Meteor.userId()) {
    FlowRouter.go('dashboard')
  }
}

// SUBSCRIPTIONS

FlowRouter.subscriptions = function () {
  // this.register('mySub', Meteor.subscribe('mySubName'));
};

// TRIGGERS

FlowRouter.triggers.enter([
  ensureSignedIn
],
{
  only: ['dashboard', 'medialist']
});

FlowRouter.triggers.enter([
  dashboardIfSignedIn
],
{
  only: ['home']
});

FlowRouter.triggers.exit([
  // myExitFunc
] /* , {
  only: ['myRoute'],
  except: ['myOtherRoute']
} */);

// ************************* ROUTES ********************************
FlowRouter.route('/', {
  name: 'home',
  triggersEnter: [],
  action: function (params, queryParams) {
    BlazeLayout.render('Layout', {main: 'home'});
  },
  triggersExit: []
});
FlowRouter.route('/dashboard', {
  name: 'dashboard',
  triggersEnter: [],
  action: function(params, queryParams) {
    BlazeLayout.render('Layout', {main: 'dashboard'});
  },
  triggersExit: []
});
FlowRouter.route('/components', {
  name: 'components',
  triggersEnter: [],
  action: function(params, queryParams) {
    BlazeLayout.render('Layout', {main: 'components'});
  },
  triggersExit: []
});

FlowRouter.route('/medialist/:slug', {
  name: 'medialist',
  triggersEnter: [],
  action: function(params, queryParams) {
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
    BlazeLayout.render('Layout', {main: 'medialist'});
  },
  triggersExit: []
});
