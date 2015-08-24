Slide-ins package for Meteor and Bootstrap
==========================================

## Description

Allows the user to open panes on the left or right of the screen, populated with specified templates and data context.

## Usage

**SlideIns.show(dir, template, data)** - open the specified slide-in, or close and reopen if it already open.

* *dir* [`left` or `right`] - which side of the screen to open.
* *template* [*String*] - name of the template to render into the slide-in before showing it (optional).
* *data* [*Object*] - data context with which to render the specified template (optional).

If no template is specified, the existing contents will be shown.  If the same template as currently shown is specified, the slide-in will not close and reopen, it will simply re-render with the new data context.

**SlideIns.hide(dir)** - hide the specified slide-in.

* *dir* [`left` or `right`] - which side of the screen to close.

## Width

At present, the width of the slide-ins is specified by the css in the package directory.  If necessary, this can be amended to be use a less variable, which could potentially be over-written in the main app when the less is imported.
