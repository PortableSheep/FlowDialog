/**
 * FlowDialog Core - Framework-agnostic modal dialog with flow support
 * @version 2.0.0
 * @license MIT
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
		// CommonJS
		module.exports = factory();
	} else {
		// Browser globals
		root.FlowDialog = factory();
	}
}(typeof self !== 'undefined' ? self : this, function() {
	'use strict';

	/**
	 * Default options for FlowDialog
	 */
	var defaults = {
		height: 'auto',
		growToHeight: false,
		width: 600,
		showCloseButton: true,
		closeOnEscape: false,
		closeOnOverlayClick: false,
		autoOpen: false,
		appendTo: null, // Will default to document.body
		hideEmptyFooter: true,
		hideEmptyTitle: false,
		useTransitions: true,
		animateDuration: 250,
		flow: []
	};

	/**
	 * Utility functions
	 */
	var utils = {
		/**
		 * Extend target object with source objects
		 */
		extend: function(target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];
				if (source) {
					for (var key in source) {
						if (source.hasOwnProperty(key)) {
							target[key] = source[key];
						}
					}
				}
			}
			return target;
		},

		/**
		 * Check if value is a plain object
		 */
		isPlainObject: function(obj) {
			return obj !== null && typeof obj === 'object' && obj.constructor === Object;
		},

		/**
		 * Create element from HTML string
		 */
		createElement: function(html) {
			var div = document.createElement('div');
			div.innerHTML = html.trim();
			return div.firstChild;
		},

		/**
		 * Get computed style value
		 */
		getStyle: function(element, property) {
			return window.getComputedStyle(element).getPropertyValue(property);
		},

		/**
		 * Animate element properties
		 */
		animate: function(element, properties, duration, callback) {
			var start = performance.now();
			var initial = {};
			
			// Store initial values
			for (var prop in properties) {
				var currentValue = this.getStyle(element, prop);
				initial[prop] = parseFloat(currentValue) || 0;
			}

			var step = function(timestamp) {
				var progress = Math.min((timestamp - start) / duration, 1);
				
				for (var prop in properties) {
					var targetValue = parseFloat(properties[prop]);
					var currentValue = initial[prop] + (targetValue - initial[prop]) * progress;
					
					if (prop === 'opacity') {
						element.style[prop] = currentValue;
					} else {
						element.style[prop] = currentValue + 'px';
					}
				}

				if (progress < 1) {
					requestAnimationFrame(step);
				} else if (callback) {
					callback();
				}
			};

			requestAnimationFrame(step);
		}
	};

	/**
	 * FlowDialog Constructor
	 */
	function FlowDialog(element, options) {
		this.element = element;
		this.options = utils.extend({}, defaults, options);
		
		this.flowTemplate = '<div class="flowdialog-flowcontent">' +
			'<div class="flowdialog-header"><button type="button" class="flowdialog-close" data-dismiss="modal" aria-hidden="true">×</button><h4 class="flowdialog-title"></h4></div>' +
			'<div class="flowdialog-content"></div>' +
			'<div class="flowdialog-footer"></div>' +
			'</div>';
		
		this._flow = [];
		this.flowIndex = 0;
		this.isShowing = false;
		this.isFlowing = false;
		this.eventHandlers = {};

		// Initialize
		this.init();
		
		// Initialize flow content
		if (this.options.flow.length > 0) {
			for (var i = 0; i < this.options.flow.length; i++) {
				this.initFlow(this.options.flow[i]);
			}
		}
		
		this._trigger('onInitComplete');
	}

	/**
	 * FlowDialog prototype methods
	 */
	FlowDialog.prototype = {
		/**
		 * Initialize the dialog
		 */
		init: function() {
			// Abort if already initialized
			if (this.$modal !== undefined) return;

			var self = this;
			var appendTo = this.options.appendTo || document.body;

			// Create overlay
			this.$overlay = utils.createElement('<div class="flowdialog-overlay"></div>');
			
			// Create modal container
			var containerHtml = '<div class="flowdialog-container"><div class="flowdialog-modal" tabindex="-1"></div></div>';
			this.$container = utils.createElement(containerHtml);
			this.$modal = this.$container.querySelector('div.flowdialog-modal');

			// Bind window events
			this._resizeHandler = this.reposition.bind(this);
			this._scrollHandler = this.reposition.bind(this);
			window.addEventListener('resize', this._resizeHandler);
			window.addEventListener('scroll', this._scrollHandler);

			// Append to DOM
			appendTo.appendChild(this.$container);
			document.body.appendChild(this.$overlay);

			// Bind close button clicks
			this._closeHandler = function(e) {
				if (e.target.classList.contains('flowdialog-close')) {
					e.preventDefault();
					self.close();
				}
			};
			this.$modal.addEventListener('click', this._closeHandler);

			// Initialize default element as first flow item
			this.initFlow(this.element);

			// Refresh options for active flow item
			this.refreshOptions();

			// Open if autoOpen is true
			if (this.options.autoOpen) {
				this.open();
			}
		},

		/**
		 * Initialize a flow item
		 */
		initFlow: function(obj) {
			// Convert element to proper object
			if (obj instanceof Element || obj instanceof HTMLElement) {
				obj = { target: obj };
			}

			// Validate object
			if (!(utils.isPlainObject(obj) && obj.target)) return;

			// Pull in options per flow object
			for (var k in this.options) {
				if (k === 'flow') continue;
				if (!obj.hasOwnProperty(k)) {
					obj[k] = this.options[k];
				}
			}

			// Create flow container
			var $modalFlowDom = utils.createElement(this.flowTemplate);
			this.$modal.appendChild($modalFlowDom);

			// Cache DOM elements
			obj._$header = $modalFlowDom.querySelector('div.flowdialog-header');
			obj._$btnClose = obj._$header.querySelector('button.flowdialog-close');
			obj._$title = $modalFlowDom.querySelector('h4.flowdialog-title');
			obj._$title.innerHTML = obj.target.getAttribute('title') || '';
			obj._$content = $modalFlowDom.querySelector('div.flowdialog-content');
			obj._$footer = $modalFlowDom.querySelector('div.flowdialog-footer');

			// Handle footer
			var $eleFooter = obj.target.querySelector('div[data-type="footer"]');
			if ($eleFooter) {
				// Move footer content
				while ($eleFooter.firstChild) {
					obj._$footer.appendChild($eleFooter.firstChild);
				}
				$eleFooter.remove();
			} else if (obj.hideEmptyFooter) {
				obj._$footer.style.display = 'none';
			}

			// Append target to content
			obj._$content.appendChild(obj.target);
			obj.target.style.display = 'block';

			// Reassign target to modal container
			obj.target = $modalFlowDom;

			// Add to flow stack
			this._flow.push(obj);
		},

		/**
		 * Open the dialog
		 */
		open: function(index) {
			if (index !== undefined && this._flow.length >= index && this._flow[index] !== null) {
				this.flowIndex = index;
			}

			var self = this;
			document.body.classList.add('flowdialog-modalopen');
			this.refreshOptions();

			if (this.options.useTransitions) {
				var overlayOpacity = utils.getStyle(this.$overlay, 'opacity') || '0.4';
				var modalTop = utils.getStyle(this.$modal, 'top') || '0';

				// Fade in overlay
				this.$overlay.style.opacity = '0';
				this.$overlay.style.display = 'block';
				utils.animate(this.$overlay, { opacity: overlayOpacity }, this.options.animateDuration, function() {
					// Show container and modal
					self.$container.style.display = 'block';
					self._flow[self.flowIndex].target.style.display = 'block';
					utils.animate(self._flow[self.flowIndex].target, { opacity: 1 }, self.options.animateDuration);
					
					self.$modal.style.top = '-30%';
					self.$modal.style.opacity = '0';
					self.$modal.style.display = 'block';
					utils.animate(self.$modal, { 
						top: parseFloat(modalTop), 
						opacity: 1 
					}, self.options.animateDuration);
				});
			} else {
				this.$overlay.style.display = 'block';
				this.$container.style.display = 'block';
				this._flow[this.flowIndex].target.style.display = 'block';
				this._flow[this.flowIndex].target.style.opacity = '1';
				this.$modal.style.display = 'block';
			}

			// Focus modal
			setTimeout(function() {
				self.$modal.focus();
			}, this.options.animateDuration);

			this.isShowing = true;
			this._trigger('onOpen');
		},

		/**
		 * Close the dialog
		 */
		close: function() {
			if (!this._trigger('onPreClose')) return;

			var self = this;

			var finalize = function() {
				self.flowIndex = 0;
				for (var i = 0; i < self._flow.length; i++) {
					self._flow[i].target.style.display = 'none';
					self._flow[i].target.style.opacity = '';
				}
				self.isShowing = false;
				self._trigger('onClose');
			};

			if (this.options.useTransitions) {
				// Animate modal out
				utils.animate(this.$modal, { 
					top: -parseFloat(utils.getStyle(this.$modal, 'height')) * 0.3, 
					opacity: 0 
				}, this.options.animateDuration, function() {
					self.$modal.style.display = 'none';
					self.$modal.style.top = '';
					self.$modal.style.opacity = '';
					self.$container.style.display = 'none';

					// Fade out overlay
					utils.animate(self.$overlay, { opacity: 0 }, self.options.animateDuration, function() {
						self.$overlay.style.display = 'none';
						self.$overlay.style.opacity = '';
						document.body.classList.remove('flowdialog-modalopen');
						finalize();
					});
				});
			} else {
				this.$modal.style.display = 'none';
				this.$container.style.display = 'none';
				this.$overlay.style.display = 'none';
				document.body.classList.remove('flowdialog-modalopen');
				finalize();
			}
		},

		/**
		 * Get/Set option
		 */
		option: function(k, v) {
			if (k === undefined || k === 'target') {
				return this.element;
			}

			if (utils.isPlainObject(k) && v === undefined) {
				// Set via map
				for (var i in k) {
					if (this._flow[this.flowIndex][i] !== k[i]) {
						this._flow[this.flowIndex][i] = k[i];
					}
				}
			} else if (k !== undefined && v !== undefined) {
				// Setter
				if (this._flow[this.flowIndex][k] !== v) {
					this._flow[this.flowIndex][k] = v;
				}
			} else {
				// Getter
				return this._flow[this.flowIndex][k];
			}

			this.refreshOptions();
		},

		/**
		 * Refresh options
		 */
		refreshOptions: function(fromFlow) {
			var flowOpt = this._flow[this.flowIndex];
			var heightOpts = {
				'height': (flowOpt.growToHeight && flowOpt.height !== 'auto' ? 'auto' : flowOpt.height),
				'max-height': (flowOpt.growToHeight && flowOpt.height !== 'auto' ? flowOpt.height : '')
			};

			// Reposition
			this.reposition();

			if (!fromFlow) {
				if (this.options.useTransitions && this.isShowing) {
					if (!flowOpt.growToHeight) {
						flowOpt._$content.style.maxHeight = '';
					}
					// Animate height
					var props = {};
					if (heightOpts.height !== 'auto') {
						props.height = heightOpts.height;
					}
					if (Object.keys(props).length > 0) {
						utils.animate(flowOpt._$content, props, this.options.animateDuration);
					}
				} else {
					flowOpt._$content.style.height = heightOpts.height === 'auto' ? 'auto' : heightOpts.height + 'px';
					flowOpt._$content.style.maxHeight = heightOpts['max-height'] ? heightOpts['max-height'] + 'px' : '';
				}
			} else {
				flowOpt._$content.style.height = heightOpts.height === 'auto' ? 'auto' : heightOpts.height + 'px';
				flowOpt._$content.style.maxHeight = heightOpts['max-height'] ? heightOpts['max-height'] + 'px' : '';
			}

			// Set overflow class
			if (flowOpt.height !== 'auto') {
				flowOpt._$content.classList.add('flowdialog-overflow');
			} else {
				flowOpt._$content.classList.remove('flowdialog-overflow');
			}

			// Toggle close button
			if (!flowOpt.showCloseButton) {
				flowOpt._$btnClose.style.display = 'none';
			} else {
				flowOpt._$btnClose.style.display = '';
				flowOpt._$header.style.display = '';
			}

			// Hide header if empty
			if (flowOpt.hideEmptyTitle && flowOpt._$title.textContent.trim().length === 0 && !flowOpt.showCloseButton) {
				flowOpt._$header.style.display = 'none';
			} else {
				flowOpt._$header.style.display = '';
			}

			// Bind escape handler
			if (flowOpt.closeOnEscape) {
				if (this._escapeHandler) {
					document.removeEventListener('keyup', this._escapeHandler);
				}
				this._escapeHandler = function(e) {
					if ((e.which || e.keyCode) === 27) {
						this.close();
					}
				}.bind(this);
				document.addEventListener('keyup', this._escapeHandler);
			} else if (this._escapeHandler) {
				document.removeEventListener('keyup', this._escapeHandler);
				this._escapeHandler = null;
			}

			// Bind overlay click handler
			if (flowOpt.closeOnOverlayClick) {
				if (this._overlayClickHandler) {
					this.$container.removeEventListener('click', this._overlayClickHandler);
				}
				this._overlayClickHandler = function() {
					this.close();
				}.bind(this);
				this.$container.addEventListener('click', this._overlayClickHandler);
			} else if (this._overlayClickHandler) {
				this.$container.removeEventListener('click', this._overlayClickHandler);
				this._overlayClickHandler = null;
			}
		},

		/**
		 * Reposition the dialog
		 */
		reposition: function() {
			var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
			var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
			
			// Set overlay dimensions
			this.$overlay.style.width = viewportWidth + 'px';
			this.$overlay.style.height = viewportHeight + 'px';
			this.$container.style.width = viewportWidth + 'px';
			this.$container.style.height = viewportHeight + 'px';

			// Position modal - center horizontally
			var width = this._flow[this.flowIndex].width;
			var left = Math.max(0, (viewportWidth - width) / 2) + (window.pageXOffset || document.documentElement.scrollLeft || 0);

			if (!this.isShowing || !this.options.useTransitions) {
				this.$modal.style.width = width + 'px';
				this.$modal.style.left = left + 'px';
			} else if (this.options.useTransitions) {
				this.$modal.style.left = left + 'px';
				utils.animate(this.$modal, { 'width': width }, this.options.animateDuration);
			}

			this._trigger('onReposition');
		},

		/**
		 * Flow to a specific index
		 */
		flowTo: function(index) {
			var self = this;
			
			// Validate index
			if (this._flow.length <= 1 || index > this._flow.length - 1 || index < 0) {
				return Promise.reject(new Error('Invalid flow index: ' + index + '. Valid range is 0-' + (this._flow.length - 1)));
			}

			return new Promise(function(resolve, reject) {
				var currentFlow = self._flow[self.flowIndex];
				var targetFlow = self._flow[index];
				self.isFlowing = true;

				if (self.options.useTransitions) {
					// Always measure target height for smooth animation between steps
					var targetHeight;
					targetFlow.target.style.position = 'absolute';
					targetFlow.target.style.left = '-9999px';
					targetFlow.target.style.visibility = 'hidden';
					targetFlow.target.style.display = 'block';
					targetFlow.target.style.width = targetFlow.width + 'px';
					targetFlow._$content.style.height = 'auto';
					
					targetHeight = targetFlow._$content.offsetHeight;
					
					// Apply max-height constraint if using growToHeight
					if (targetFlow.growToHeight && targetFlow.height !== 'auto') {
						targetHeight = Math.min(targetHeight, targetFlow.height);
					} else if (targetFlow.height !== 'auto') {
						// Use configured height if not auto or growToHeight
						targetHeight = Math.min(targetHeight, targetFlow.height);
					}
					
					targetFlow.target.style.position = '';
					targetFlow.target.style.left = '';
					targetFlow.target.style.visibility = '';
					targetFlow.target.style.display = '';

					// Hide overflow during animation
					self.$modal.style.overflow = 'hidden';

					// Fade out current
					utils.animate(currentFlow.target, { opacity: 0 }, self.options.animateDuration, function() {
						// Prepare target
						targetFlow._$content.style.height = currentFlow._$content.offsetHeight + 'px';
						targetFlow._$content.style.maxHeight = '';
						targetFlow.target.style.display = 'block';
						currentFlow.target.style.display = 'none';

						// Animate dimensions
						utils.animate(targetFlow._$content, { 
							height: targetHeight
						}, self.options.animateDuration);
						
						utils.animate(self.$modal, {
							width: targetFlow.width,
							left: Math.max(0, ((window.innerWidth || document.documentElement.clientWidth) - targetFlow.width) / 2) + (window.pageXOffset || document.documentElement.scrollLeft || 0)
						}, self.options.animateDuration, function() {
							// Update flow index
							self.flowIndex = index;
							self.refreshOptions(true);
							self.$modal.style.overflow = '';

							// Fade in target
							utils.animate(targetFlow.target, { opacity: 1 }, self.options.animateDuration, function() {
								self.isFlowing = false;
								resolve();
							});
						});
					});
				} else {
					currentFlow.target.style.display = 'none';
					self.flowIndex = index;
					self.refreshOptions();
					targetFlow.target.style.opacity = '1';
					targetFlow.target.style.display = 'block';
					self.isFlowing = false;
					resolve();
				}
			});
		},

		/**
		 * Flow navigation
		 */
		flow: function(cmd, index) {
			var self = this;
			
			if (cmd === 'next') {
				this.flowTo(this.flowIndex + 1).then(function() {
					self._trigger('onFlow');
				});
			} else if (cmd === 'prev') {
				this.flowTo(this.flowIndex - 1).then(function() {
					self._trigger('onFlow');
				});
			} else if (cmd === 'index') {
				if (index === undefined) {
					return this.flowIndex;
				} else if (index !== this.flowIndex) {
					this.flowTo(index).then(function() {
						self._trigger('onFlow');
					});
				}
			}
		},

		/**
		 * Event handling
		 */
		on: function(event, handler) {
			if (!this.eventHandlers[event]) {
				this.eventHandlers[event] = [];
			}
			this.eventHandlers[event].push(handler);
		},

		off: function(event, handler) {
			if (!this.eventHandlers[event]) return;
			
			if (handler) {
				var index = this.eventHandlers[event].indexOf(handler);
				if (index > -1) {
					this.eventHandlers[event].splice(index, 1);
				}
			} else {
				this.eventHandlers[event] = [];
			}
		},

		_trigger: function(event) {
			var handlers = this.eventHandlers[event];
			if (handlers) {
				for (var i = 0; i < handlers.length; i++) {
					var result = handlers[i].call(this, this);
					if (result === false) {
						return false;
					}
				}
			}
			return true;
		},

		/**
		 * Destroy the dialog
		 */
		destroy: function() {
			// Remove event listeners
			window.removeEventListener('resize', this._resizeHandler);
			window.removeEventListener('scroll', this._scrollHandler);
			
			if (this._closeHandler) {
				this.$modal.removeEventListener('click', this._closeHandler);
			}
			if (this._escapeHandler) {
				document.removeEventListener('keyup', this._escapeHandler);
			}
			if (this._overlayClickHandler) {
				this.$container.removeEventListener('click', this._overlayClickHandler);
			}

			// Remove DOM elements
			if (this.$container && this.$container.parentNode) {
				this.$container.parentNode.removeChild(this.$container);
			}
			if (this.$overlay && this.$overlay.parentNode) {
				this.$overlay.parentNode.removeChild(this.$overlay);
			}

			// Clear references
			this.$modal = undefined;
			this.$container = undefined;
			this.$overlay = undefined;
			this.eventHandlers = {};
		}
	};

	return FlowDialog;
}));
