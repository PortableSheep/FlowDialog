/**
 * Angular FlowDialog Module
 * Angular wrapper for FlowDialog core
 * @version 2.0.0
 * @license MIT
 */

(function(angular, FlowDialog) {
	'use strict';

	// Create Angular module
	var module = angular.module('flowdialog', []);

	/**
	 * FlowDialog Service
	 * For programmatic dialog creation
	 */
	module.service('FlowDialogService', ['$document', function($document) {
		/**
		 * Create a new dialog instance
		 */
		this.create = function(element, options) {
			var el = element;
			
			// Convert jQuery object if needed
			if (element.jquery) {
				el = element[0];
			} else if (typeof element === 'string') {
				el = $document[0].querySelector(element);
			}
			
			return new FlowDialog(el, options);
		};

		/**
		 * Open a dialog with content
		 */
		this.open = function(content, options) {
			var container = angular.element('<div></div>');
			container.html(content);
			
			var el = container[0];
			var dialog = new FlowDialog(el, angular.extend({}, options, { autoOpen: true }));
			
			return dialog;
		};
	}]);

	/**
	 * FlowDialog Directive
	 * Declarative dialog usage
	 */
	module.directive('flowDialog', ['FlowDialogService', function(FlowDialogService) {
		return {
			restrict: 'A',
			scope: {
				flowDialogOptions: '=?',
				flowDialogInstance: '=?'
			},
			link: function(scope, element, attrs) {
				// Parse options
				var options = scope.flowDialogOptions || {};
				
				// Override with attribute options if present
				if (attrs.flowDialogWidth) {
					options.width = parseInt(attrs.flowDialogWidth, 10);
				}
				if (attrs.flowDialogHeight) {
					options.height = attrs.flowDialogHeight === 'auto' ? 'auto' : parseInt(attrs.flowDialogHeight, 10);
				}
				if (attrs.flowDialogAutoOpen !== undefined) {
					options.autoOpen = attrs.flowDialogAutoOpen === 'true';
				}
				if (attrs.flowDialogCloseOnEscape !== undefined) {
					options.closeOnEscape = attrs.flowDialogCloseOnEscape === 'true';
				}
				if (attrs.flowDialogCloseOnOverlayClick !== undefined) {
					options.closeOnOverlayClick = attrs.flowDialogCloseOnOverlayClick === 'true';
				}

				// Create dialog instance
				var dialog = FlowDialogService.create(element[0], options);

				// Expose instance to parent scope if binding exists
				if (scope.flowDialogInstance !== undefined) {
					scope.flowDialogInstance = dialog;
				}

				// Clean up on destroy
				scope.$on('$destroy', function() {
					dialog.destroy();
				});

				// Watch for option changes
				if (scope.flowDialogOptions) {
					scope.$watch('flowDialogOptions', function(newOptions) {
						if (newOptions) {
							for (var key in newOptions) {
								if (newOptions.hasOwnProperty(key)) {
									dialog.option(key, newOptions[key]);
								}
							}
						}
					}, true);
				}
			}
		};
	}]);

	/**
	 * Flow Dialog Controller Helper
	 * For use in controllers to manage dialogs
	 */
	module.factory('FlowDialogController', ['FlowDialogService', function(FlowDialogService) {
		function FlowDialogController(element, options) {
			this.dialog = FlowDialogService.create(element, options);
		}

		FlowDialogController.prototype.open = function(index) {
			return this.dialog.open(index);
		};

		FlowDialogController.prototype.close = function() {
			return this.dialog.close();
		};

		FlowDialogController.prototype.flow = function(cmd, index) {
			return this.dialog.flow(cmd, index);
		};

		FlowDialogController.prototype.option = function(key, value) {
			return this.dialog.option(key, value);
		};

		FlowDialogController.prototype.destroy = function() {
			return this.dialog.destroy();
		};

		return FlowDialogController;
	}]);

	// Export module
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = module;
	}

})(
	typeof angular !== 'undefined' ? angular : require('angular'),
	typeof FlowDialog !== 'undefined' ? FlowDialog : require('../core/flowdialog-core')
);
