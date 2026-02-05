# FlowDialog v2.0

Flow dialog is a **framework-agnostic** modal dialog library that's top-aligned and supports "flowing" between multiple dialog contents. Flowing allows you to accomplish wizard-like workflows without leaving the dialog.

## What's New in v2.0

**Major Modernization Update!**

FlowDialog has been completely rewritten with a modern, framework-agnostic architecture:

- ✨ **Framework-Agnostic Core** - Pure vanilla JavaScript with zero dependencies
- 🔌 **jQuery Adapter** - 100% backward compatible with v1.x jQuery plugin API
- 🅰️ **Angular Wrapper** - Native Angular directive and service
- 📦 **Modular Design** - Use only what you need
- 🎯 **TypeScript Support** - Full TypeScript definitions included
- 🚀 **Modern APIs** - Promises, ES modules, and more

## Installation

### NPM
```bash
npm install flowdialog
```

### Manual
Download the files and include them in your project.

## Usage

FlowDialog now offers three ways to use it, depending on your project needs:

### 1. Vanilla JavaScript (Framework-Agnostic Core)

**No dependencies required!** Use the core library for maximum flexibility.

```html
<link rel="stylesheet" href="flowdialog.css">
<script src="src/core/flowdialog-core.js"></script>
```

```javascript
// Create dialog instance
var dialog = new FlowDialog(document.getElementById('myDialog'), {
    width: 600,
    closeOnEscape: true,
    closeOnOverlayClick: true
});

// Open the dialog
dialog.open();

// Close the dialog
dialog.close();

// Flow to next view
dialog.flow('next');
```

[See Vanilla JS Example](examples/vanilla/index.html)

### 2. jQuery Adapter (Backward Compatible)

**100% compatible with FlowDialog v1.x!** Your existing code will work without changes.

```html
<link rel="stylesheet" href="flowdialog.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="src/core/flowdialog-core.js"></script>
<script src="src/adapters/jquery.flowdialog.js"></script>
```

```javascript
// Same API as v1.x
$('#myDialog').flowdialog({
    width: 600,
    closeOnEscape: true,
    flow: [$('#step2'), $('#step3')]
});

// Open dialog
$('#myDialog').flowdialog('open');

// Flow to next
$('#myDialog').flowdialog('flow', 'next');

// Event handlers work the same
$('#myDialog').on('flowdialog_onOpen', function() {
    console.log('Dialog opened!');
});
```

[See jQuery Example](examples/jquery/index.html)

### 3. Angular Wrapper

**Native Angular integration** with directives and services.

```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
<script src="src/core/flowdialog-core.js"></script>
<script src="src/angular/angular-flowdialog.js"></script>
```

```javascript
// Add module dependency
angular.module('myApp', ['flowdialog']);
```

**Declarative (Directive):**
```html
<div flow-dialog 
     flow-dialog-instance="dialog"
     flow-dialog-width="600"
     flow-dialog-close-on-escape="true"
     title="My Dialog">
    <p>Dialog content here</p>
    <div data-type="footer">
        <button ng-click="dialog.close()">Close</button>
    </div>
</div>

<button ng-click="dialog.open()">Open Dialog</button>
```

**Programmatic (Service):**
```javascript
angular.controller('MyController', ['FlowDialogService', function(FlowDialogService) {
    this.openDialog = function() {
        var dialog = FlowDialogService.open('<p>Dynamic content</p>', {
            width: 500
        });
    };
}]);
```

[See Angular Example](examples/angular/index.html)

## Options

All implementations support the same options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | Number | 600 | Width of the dialog in pixels |
| `height` | Number/String | 'auto' | Height of dialog content ('auto' or number) |
| `growToHeight` | Boolean | false | Grow to height instead of fixed height |
| `showCloseButton` | Boolean | true | Show close button in header |
| `closeOnEscape` | Boolean | false | Close dialog when Escape key is pressed |
| `closeOnOverlayClick` | Boolean | false | Close dialog when clicking overlay |
| `autoOpen` | Boolean | false | Automatically open dialog on init |
| `appendTo` | Element | document.body | Element to append dialog to |
| `hideEmptyFooter` | Boolean | true | Hide footer if empty |
| `hideEmptyTitle` | Boolean | false | Hide title if empty |
| `useTransitions` | Boolean | true | Use CSS transitions for animations |
| `animateDuration` | Number | 250 | Animation duration in milliseconds |
| `flow` | Array | [] | Array of flow items (elements or objects) |

## API Methods

### Core API (Vanilla JS)

```javascript
var dialog = new FlowDialog(element, options);

// Methods
dialog.open(index)              // Open dialog at optional flow index
dialog.close()                  // Close dialog
dialog.flow('next')            // Flow to next view
dialog.flow('prev')            // Flow to previous view
dialog.flow('index', 2)        // Flow to specific index
dialog.option('width', 700)    // Set option
dialog.option('width')         // Get option
dialog.reposition()            // Reposition dialog
dialog.destroy()               // Destroy and cleanup

// Events
dialog.on('onOpen', function() { })
dialog.on('onClose', function() { })
dialog.on('onPreClose', function() { })
dialog.on('onFlow', function() { })
dialog.on('onReposition', function() { })
dialog.on('onInitComplete', function() { })
```

### jQuery API

```javascript
// Same as v1.x
$('#element').flowdialog(options);
$('#element').flowdialog('open');
$('#element').flowdialog('close');
$('#element').flowdialog('flow', 'next');
$('#element').flowdialog('option', 'width', 700);

// Events (jQuery style)
$('#element').on('flowdialog_onOpen', function() { });
```

### Angular API

```html
<!-- Directive -->
<div flow-dialog flow-dialog-instance="myDialog"></div>
```

```javascript
// Service
FlowDialogService.create(element, options);
FlowDialogService.open(content, options);
```

## Migration from v1.x

If you're upgrading from FlowDialog v1.x (jQuery version):

### Option 1: No Changes Required (Recommended for quick migration)

Simply replace your script includes:

```html
<!-- OLD -->
<script src="jquery.flowdialog.js"></script>

<!-- NEW -->
<script src="src/core/flowdialog-core.js"></script>
<script src="src/adapters/jquery.flowdialog.js"></script>
```

Your existing jQuery code will work without any changes!

### Option 2: Migrate to Vanilla JS (Recommended for new projects)

If you want to remove the jQuery dependency:

**Before (v1.x with jQuery):**
```javascript
$('#myDialog').flowdialog({
    width: 600
}).flowdialog('open');
```

**After (v2.x Vanilla JS):**
```javascript
var dialog = new FlowDialog(document.getElementById('myDialog'), {
    width: 600
});
dialog.open();
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11+ (with polyfills for Promises)

## Architecture

```
flowdialog/
├── src/
│   ├── core/
│   │   ├── flowdialog-core.js      # Framework-agnostic core
│   │   └── flowdialog-core.d.ts    # TypeScript definitions
│   ├── adapters/
│   │   └── jquery.flowdialog.js    # jQuery adapter (wraps core)
│   └── angular/
│       └── angular-flowdialog.js   # Angular wrapper
├── examples/
│   ├── vanilla/                     # Vanilla JS examples
│   ├── jquery/                      # jQuery examples
│   └── angular/                     # Angular examples
├── flowdialog.css                   # Styles
└── package.json
```

## Demo

- [Vanilla JS Demo](examples/vanilla/index.html)
- [jQuery Demo](examples/jquery/index.html)
- [Angular Demo](examples/angular/index.html)

## Development

The core library (`src/core/flowdialog-core.js`) is written in pure JavaScript with no dependencies. The jQuery adapter and Angular wrapper are thin layers that provide framework-specific APIs while delegating to the core.

**Benefits of this architecture:**
- ✅ Use the library without any framework
- ✅ Smaller bundle size (use only what you need)
- ✅ Future-proof (easy to add React, Vue, etc. wrappers)
- ✅ Easier to test and maintain
- ✅ Full backward compatibility

## License

Dual licensed under MIT and GPLv2 licenses.

## Credits

Created by [Michael Gunderson](https://github.com/PortableSheep)

v2.0 modernization: Framework-agnostic core with Angular wrapper
