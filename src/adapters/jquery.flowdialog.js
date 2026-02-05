/**
 * jQuery FlowDialog Adapter
 * Wraps the framework-agnostic FlowDialog core with jQuery API
 * @version 2.0.0
 * @license MIT
 */

;(function($, FlowDialog) {
	'use strict';

	// Guard: Exit if jQuery or FlowDialog core is not available
	if (!$ || !FlowDialog) {
		if (typeof console !== 'undefined' && console.warn) {
			console.warn('FlowDialog jQuery adapter requires both jQuery and FlowDialog core to be loaded.');
		}
		return;
	}

	var pluginName = 'flowdialog';

	/**
	 * jQuery wrapper for FlowDialog core
	 */
	function jQueryFlowDialog(element, options) {
		this.element = element;
		this.$element = $(element);
		
		// Create core instance
		this.core = new FlowDialog(element, options);
		
		// Proxy core events to jQuery events
		var self = this;
		this.core.on('onInitComplete', function() {
			self.$element.trigger('flowdialog_onInitComplete', [self]);
		});
		this.core.on('onOpen', function() {
			self.$element.trigger('flowdialog_onOpen', [self]);
		});
		this.core.on('onPreClose', function() {
			var evt = $.Event('flowdialog_onPreClose');
			self.$element.triggerHandler(evt, [self]);
			return !evt.isDefaultPrevented();
		});
		this.core.on('onClose', function() {
			self.$element.trigger('flowdialog_onClose', [self]);
		});
		this.core.on('onFlow', function() {
			self.$element.trigger('flowdialog_onFlow', [self]);
		});
		this.core.on('onReposition', function() {
			self.$element.trigger('flowdialog_onReposition', [self]);
		});
	}

	/**
	 * Proxy methods to core instance
	 */
	jQueryFlowDialog.prototype = {
		init: function() {
			return this.core.init();
		},
		
		initFlow: function(obj) {
			// Convert jQuery object to DOM element if needed
			if (obj instanceof jQuery) {
				obj = { target: obj[0] };
			} else if (obj && obj.target instanceof jQuery) {
				obj.target = obj.target[0];
			}
			return this.core.initFlow(obj);
		},
		
		open: function(index) {
			return this.core.open(index);
		},
		
		close: function() {
			return this.core.close();
		},
		
		option: function(k, v) {
			return this.core.option(k, v);
		},
		
		refreshOptions: function(fromFlow) {
			return this.core.refreshOptions(fromFlow);
		},
		
		reposition: function() {
			return this.core.reposition();
		},
		
		flowTo: function(index) {
			var def = $.Deferred();
			this.core.flowTo(index)
				.then(function() {
					def.resolve();
				})
				.catch(function() {
					def.reject();
				});
			return def.promise();
		},
		
		flow: function(cmd, index) {
			return this.core.flow(cmd, index);
		},
		
		destroy: function() {
			return this.core.destroy();
		},
		
		// Expose core for advanced usage
		getCore: function() {
			return this.core;
		}
	};

	/**
	 * jQuery plugin interface
	 */
	if ($ && $.fn) {
		$.fn[pluginName] = function(o) {
			var options = ($.isPlainObject(o) ? o : {});
			var instance = $.data(this, 'plugin_' + pluginName);

			if (instance) {
				// We have an instance
				if (typeof o === 'string' && instance[o] && $.isFunction(instance[o])) {
					// Call method
					var args = (arguments.length >= 2 ? Array.prototype.slice.call(arguments, 1) : []);
					var ret = instance[o].apply(instance, args);
					return ret === undefined ? this : ret;
				}
				return this;
			} else {
				// Create new instance
				instance = new jQueryFlowDialog(this[0], options);
				$.data(this, 'plugin_' + pluginName, instance);
				return this;
			}
		};
	}

})(typeof jQuery !== 'undefined' ? jQuery : (typeof $ !== 'undefined' ? $ : null), 
   typeof FlowDialog !== 'undefined' ? FlowDialog : (typeof require !== 'undefined' ? require('../core/flowdialog-core') : null));
