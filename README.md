# FlowDialog

Flow dialog is a **framework-agnostic** modal dialog library that's top-aligned and supports "flowing" between multiple dialog contents.

Flowing allows you to accomplish wizard-like workflows without leaving the dialog.

## Quick Links

- 🎯 [**Interactive Demo**](https://portablesheep.github.io/FlowDialog/examples/) - Try it live!
- 💻 [**Examples**](examples/) - Vanilla JS, jQuery, and Angular examples
- 📦 [**NPM Package**](https://www.npmjs.com/package/flowdialog)

## Features

- ✨ **Framework-Agnostic Core** - Pure vanilla JavaScript with zero dependencies
- 🔌 **jQuery Adapter** - 100% backward compatible with v1.x
- 🅰️ **Angular Wrapper** - Native Angular directive and service
- 📦 **Modular Design** - Use only what you need
- 🎯 **TypeScript Support** - Full TypeScript definitions included
- 🚀 **Modern APIs** - Promises, event handling, and more
- 🎨 **Flow/Wizard Support** - Create multi-step experiences
- ⌨️ **Keyboard Navigation** - ESC to close, arrow keys supported
- 📱 **Responsive** - Works on all screen sizes

## Installation

```bash
npm install flowdialog
```

## Quick Start

### Vanilla JavaScript (No Dependencies!)

```html
<link rel="stylesheet" href="flowdialog.css">
<script src="src/core/flowdialog-core.js"></script>

<script>
var dialog = new FlowDialog(document.getElementById('myDialog'), {
    width: 600,
    closeOnEscape: true
});
dialog.open();
</script>
```

### jQuery (Backward Compatible)

```html
<script src="jquery.min.js"></script>
<script src="src/core/flowdialog-core.js"></script>
<script src="src/adapters/jquery.flowdialog.js"></script>

<script>
$('#myDialog').flowdialog({ width: 600 }).flowdialog('open');
</script>
```

### Angular

```html
<script src="angular.min.js"></script>
<script src="src/core/flowdialog-core.js"></script>
<script src="src/angular/angular-flowdialog.js"></script>

<div flow-dialog flow-dialog-instance="dialog" title="My Dialog">
    Content here
</div>
<button ng-click="dialog.open()">Open</button>
```

## Documentation

For detailed examples and usage patterns, see the [examples](examples/) directory which includes:
- Vanilla JavaScript examples
- jQuery adapter examples  
- Angular wrapper examples

## More Information

Check out the [interactive demo](https://portablesheep.github.io/FlowDialog/examples/) to try all the features live!

## License

Dual licensed under MIT and GPL licenses.