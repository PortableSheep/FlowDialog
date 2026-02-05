# FlowDialog

> **📢 Version 2.0 Released!** FlowDialog has been modernized with a framework-agnostic core. See [v2.0 Documentation](README-v2.md) and [Migration Guide](MIGRATION.md).

Flow dialog is a modal dialog library that's top-aligned and supports "flowing" between multiple dialog contents.

Flowing allows you to accomplish wizard-like workflows without leaving the dialog.

## Quick Links

- 📘 [**v2.0 Documentation**](README-v2.md) - Complete guide for v2.0
- 🔄 [**Migration Guide**](MIGRATION.md) - Upgrade from v1.x to v2.0
- 🎯 [**Live Demo**](http://portablesheep.github.io/projects/FlowDialog/readme/index.html)
- 💻 [**Examples**](examples/) - Vanilla JS, jQuery, and Angular examples

## What's New in v2.0

FlowDialog v2.0 represents a complete modernization:

- ✨ **Framework-Agnostic Core** - Pure vanilla JavaScript with zero dependencies
- 🔌 **jQuery Adapter** - 100% backward compatible with v1.x
- 🅰️ **Angular Wrapper** - Native Angular directive and service
- 📦 **Modular Design** - Use only what you need
- 🎯 **TypeScript Support** - Full TypeScript definitions included
- 🚀 **Modern APIs** - Promises, ES modules, and more

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

- [**Full v2.0 Documentation**](README-v2.md)
- [**Migration Guide**](MIGRATION.md)
- [**Examples**](examples/)

## Demo
[http://portablesheep.github.io/projects/FlowDialog/readme/index.html](http://portablesheep.github.io/projects/FlowDialog/readme/index.html)