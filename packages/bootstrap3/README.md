## Bootstrap 3 for Meteor
Modular, configurable, customizable.

## How to use
In your Meteor project, create an empty file named `bootstrap-settings.json` and place it in any client folder.

The package will automatically populate the file if it is empty.

### For those newer to Meteor
This means any folder in your Meteor project that is loaded on the client only.  Per the [Meteor documentation on file structure](http://docs.meteor.com/#/full/structuringyourapp) that would be any folder named `client`.  The usual place to put files relating to *style* (such as Bootstrap) is `client/stylesheets`.  All you have to do is make an empty file named `bootstrap-settings.json` and place it in `client/stylesheets` or some similar folder (you might have to make the folders).

Then go to your console and type `meteor run` and the huttonr:bootstrap3 package will automatically fill your `bootstrap-settings.json` file with all of the default settings.  At this point you will be able to use bootstrap classes in your html files such as `<div class="container jumbotron">Hello World</div>` or `<span class="glyphicon glyphicon-heart"></span>`.

### Custom settings
The settings json file is automatically populated with the default settings, however each of these can be changed and individual modules can be turned on and off.  The default `bootstrap-settings.json` file has the following structure:

```json
{
  "less": {
    "customVariables": false,

    "exposeMixins": false,

    "compile": true,

    "modules": {
       "alerts": true,
       "badges": true,
       "breadcrumbs": true,
       "button-groups": true,
       "buttons": true,
       "carousel": true,
       "close": true,
       "code": true,
       "component-animations": true,
       "dropdowns": true,
       "forms": true,
       "glyphicons": true,
       "grid": true,
       "input-groups": true,
       "jumbotron": true,
       "labels": true,
       "list-group": true,
       "media": true,
       "modals": true,
       "navbar": true,
       "navs": true,
       "normalize": true,
       "pager": true,
       "pagination": true,
       "panels": true,
       "popovers": true,
       "print": true,
       "progress-bars": true,
       "responsive-embed": true,
       "responsive-utilities": true,
       "scaffolding": true,
       "tables": true,
       "thumbnails": true,
       "tooltip": true,
       "type": true,
       "utilities": true,
       "wells": true
    }
  },

  "javascript": {
    "expose": false,

    "modules": {
      "affix": true,
      "alert": true,
      "button": true,
      "carousel": true,
      "collapse": true,
      "dropdown": true,
      "modal": true,
      "popover": true,
      "scrollspy": true,
      "tab": true,
      "tooltip": true,
      "transition": true
    }
  }
}
```

These settings perform the following duties:

#### `less`
`customVariables` **Boolean** (default: *false*)  Enable this to expose a custom bootstrap variables file you can edit.  
`exposeMixins` **Boolean** (default: *false*)  Enable this to expose an importable less file with the bootstrap mixins for your use.  
`compile` **Boolean** (default: *true*)  Disable this to expose the raw bootstrap less and leave it to the less package to compile.  
`modules` **Object**  Enable or disable specific bootstrap less modules. *(The listed order of these is unimportant.)*

#### `javascript`
`expose` **Boolean** (default: *false*)  Enable to expose the raw bootstrap javascript.  
`modules` **Object**  Enable or disable specific bootstrap js modules. *(The listed order of these is unimportant.)*
