Meteor Tablesort
================

## API

```javascript
var tablesort = MeteorTablesort(el, refreshFunc)
```

**el** - selector, element or jQuery element referring to the table to which to add tablesort.

**refreshFunc** - a function which will rerun when the table needs to refresh its sort.

## Example

If you have a query object stored in reactive-var `myQuery` and filters `MyDocs`, your tablesort init would look like:

```javascript
var tablesort = MeteorTablesort('#my-table', () => MyDocs.find(myQuery.get()).fetch())
```

**NOTE** - if you don't `fetch()` the results in your `refreshFunc`, the reactivity will only be on the query (reactive-var), **not** on the result set.  To refresh the sort whenever the result set changes (e.g. when another user adds a document), you need to `fetch()` the results.
