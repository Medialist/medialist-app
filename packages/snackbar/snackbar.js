Snackbar = (msg, opts) => $.snackbar(_.extend({content: msg}, opts))
Snackbar.info = (msg, opts) => Snackbar(msg, _.extend({style: 'snackbar-primary'}, opts))
Snackbar.warn = (msg, opts) => Snackbar(msg, _.extend({style: 'snackbar-warning'}, opts))
Snackbar.error = (msg, opts) => Snackbar(msg, _.extend({style: 'snackbar-danger'}, opts))
