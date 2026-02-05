# FlowDialog v2.0 Migration Guide

This guide helps you migrate from FlowDialog v1.x (jQuery-only) to v2.0 (framework-agnostic with adapters).

## What's New in v2.0

FlowDialog v2.0 represents a major architectural modernization:

1. **Framework-Agnostic Core** - Pure vanilla JavaScript with zero dependencies
2. **jQuery Adapter** - 100% backward compatible wrapper for v1.x API
3. **Angular Wrapper** - Native Angular directive and service
4. **Modern APIs** - Promises instead of jQuery Deferreds
5. **TypeScript Support** - Full TypeScript definitions
6. **Modular Design** - Use only what you need

## Breaking Changes

### For jQuery Users: NONE!

If you're using the jQuery adapter, there are **no breaking changes**. The API is 100% backward compatible.

### For Vanilla JS Users

If you were somehow using the internals directly (highly unlikely in v1.x), you'll need to use the new API.

## Migration Paths

### Path 1: Keep Using jQuery (Recommended for Quick Migration)

**Effort: Minimal (just update script tags)**

If your project already uses jQuery and you want to keep using it, simply update your script includes:

**Before (v1.x):**
```html
<link rel="stylesheet" href="flowdialog.css">
<script src="jquery.min.js"></script>
<script src="jquery.flowdialog.js"></script>
```

**After (v2.x):**
```html
<link rel="stylesheet" href="flowdialog.css">
<script src="jquery.min.js"></script>
<script src="src/core/flowdialog-core.js"></script>
<script src="src/adapters/jquery.flowdialog.js"></script>
```

Your existing code will work without any changes!

### Path 2: Remove jQuery Dependency (Recommended for New Projects)

**Effort: Moderate (rewrite API calls)**

If you want to remove the jQuery dependency, migrate to the vanilla JS core:

**Before (v1.x with jQuery):**
```javascript
// Initialize
$('#myDialog').flowdialog({
    width: 600,
    closeOnEscape: true
});

// Open
$('#myDialog').flowdialog('open');

// Flow
$('#myDialog').flowdialog('flow', 'next');

// Events
$('#myDialog').on('flowdialog_onOpen', function() {
    console.log('Opened!');
});
```

**After (v2.x Vanilla JS):**
```javascript
// Initialize
var dialog = new FlowDialog(document.getElementById('myDialog'), {
    width: 600,
    closeOnEscape: true
});

// Open
dialog.open();

// Flow
dialog.flow('next');

// Events
dialog.on('onOpen', function() {
    console.log('Opened!');
});
```

### Path 3: Migrate to Angular

**Effort: Moderate to High (depends on your application)**

If you're building an Angular application, use the Angular wrapper:

**Before (v1.x with jQuery in Angular):**
```javascript
// In controller
$scope.openDialog = function() {
    $('#myDialog').flowdialog('open');
};
```

**After (v2.x with Angular):**
```html
<!-- Declarative -->
<div flow-dialog 
     flow-dialog-instance="dialog"
     flow-dialog-width="600"
     title="My Dialog">
    <p>Content here</p>
</div>

<button ng-click="dialog.open()">Open</button>
```

Or programmatically:

```javascript
angular.controller('MyCtrl', ['FlowDialogService', function(FlowDialogService) {
    this.openDialog = function() {
        var dialog = FlowDialogService.create(element, options);
        dialog.open();
    };
}]);
```

## API Changes

### Events

**jQuery Adapter (v2.x)** - Same as v1.x:
```javascript
$('#dialog').on('flowdialog_onOpen', handler);
```

**Vanilla JS Core (v2.x)** - New event system:
```javascript
dialog.on('onOpen', handler);
```

### Promises vs jQuery Deferreds

**jQuery Adapter** - Still returns jQuery Deferreds for compatibility:
```javascript
$('#dialog').flowdialog('flowTo', 2).done(function() {
    console.log('Flowed!');
});
```

**Vanilla JS Core** - Returns native Promises:
```javascript
dialog.flowTo(2).then(function() {
    console.log('Flowed!');
});
```

### Method Chaining

**jQuery Adapter** - Supports chaining like v1.x:
```javascript
$('#dialog')
    .flowdialog({ width: 600 })
    .flowdialog('open');
```

**Vanilla JS Core** - Methods don't return instance (except where noted):
```javascript
var dialog = new FlowDialog(element, { width: 600 });
dialog.open();
```

## NPM/Package Manager Changes

**v1.x package.json:**
```json
{
  "dependencies": {
    "flowdialog": "^1.0.9"
  }
}
```

**v2.x package.json:**
```json
{
  "dependencies": {
    "flowdialog": "^2.0.0"
  },
  "peerDependencies": {
    "jquery": ">=1.8"  // Optional - only if using jQuery adapter
  }
}
```

**Importing in v2.x:**

```javascript
// Core (vanilla JS)
import FlowDialog from 'flowdialog';

// jQuery adapter
import 'flowdialog/jquery';  // Adds $.fn.flowdialog

// Angular wrapper
import 'flowdialog/angular';  // Adds 'flowdialog' module

// CSS
import 'flowdialog/css';
```

## Testing Your Migration

1. **Keep v1.x running** - Don't remove the old version until testing is complete
2. **Test in development** - Verify all dialogs open, close, and flow correctly
3. **Check console** - Look for any errors or warnings
4. **Test interactions** - Verify buttons, events, and callbacks work
5. **Cross-browser testing** - Test in all browsers you support

## Rollback Plan

If you encounter issues, you can easily rollback:

1. Revert script changes
2. Change back from v2.x to v1.x in package.json
3. Run `npm install`

## Getting Help

- Check [examples](../examples/) for working code
- Review [README-v2.md](../README-v2.md) for full API documentation
- Open an issue on GitHub if you encounter problems

## Benefits of Migrating

Even if you keep using jQuery:

✅ Smaller core library (pure JavaScript)  
✅ Better performance (no jQuery overhead in core)  
✅ Future-proof (can add React, Vue, Svelte wrappers later)  
✅ TypeScript support  
✅ Modern Promise-based APIs  
✅ Better testability  

For Angular projects:

✅ Native Angular integration  
✅ Directive for declarative usage  
✅ Service for programmatic control  
✅ Proper digest cycle integration  

For new projects without framework dependencies:

✅ Zero dependencies  
✅ Smaller bundle size  
✅ Modern JavaScript  
✅ Framework-agnostic  
