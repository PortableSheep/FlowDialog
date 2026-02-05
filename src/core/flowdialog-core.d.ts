/**
 * TypeScript definitions for FlowDialog
 * @version 2.0.0
 */

export interface FlowDialogOptions {
	/**
	 * Height of the dialog content
	 * @default 'auto'
	 */
	height?: number | 'auto';

	/**
	 * Grow to height instead of fixed height
	 * @default false
	 */
	growToHeight?: boolean;

	/**
	 * Width of the dialog
	 * @default 600
	 */
	width?: number;

	/**
	 * Show close button in header
	 * @default true
	 */
	showCloseButton?: boolean;

	/**
	 * Close dialog on Escape key press
	 * @default false
	 */
	closeOnEscape?: boolean;

	/**
	 * Close dialog when clicking on overlay
	 * @default false
	 */
	closeOnOverlayClick?: boolean;

	/**
	 * Automatically open dialog on initialization
	 * @default false
	 */
	autoOpen?: boolean;

	/**
	 * Element to append dialog to
	 * @default document.body
	 */
	appendTo?: HTMLElement;

	/**
	 * Hide footer if empty
	 * @default true
	 */
	hideEmptyFooter?: boolean;

	/**
	 * Hide title if empty
	 * @default false
	 */
	hideEmptyTitle?: boolean;

	/**
	 * Use CSS transitions for animations
	 * @default true
	 */
	useTransitions?: boolean;

	/**
	 * Duration of animations in milliseconds
	 * @default 250
	 */
	animateDuration?: number;

	/**
	 * Array of flow items
	 * @default []
	 */
	flow?: Array<HTMLElement | FlowItem>;
}

export interface FlowItem {
	/**
	 * Target element for this flow item
	 */
	target: HTMLElement;

	/**
	 * Options specific to this flow item (inherits from dialog options)
	 */
	[key: string]: any;
}

export type FlowDialogEventHandler = (dialog: FlowDialog) => boolean | void;

export class FlowDialog {
	/**
	 * The original element
	 */
	element: HTMLElement;

	/**
	 * Current options
	 */
	options: FlowDialogOptions;

	/**
	 * Whether dialog is currently showing
	 */
	isShowing: boolean;

	/**
	 * Whether dialog is currently flowing between views
	 */
	isFlowing: boolean;

	/**
	 * Current flow index
	 */
	flowIndex: number;

	/**
	 * Create a new FlowDialog instance
	 * @param element The element to use as dialog content
	 * @param options Dialog options
	 */
	constructor(element: HTMLElement, options?: FlowDialogOptions);

	/**
	 * Initialize the dialog
	 */
	init(): void;

	/**
	 * Initialize a flow item
	 * @param obj Flow item or element
	 */
	initFlow(obj: HTMLElement | FlowItem): void;

	/**
	 * Open the dialog
	 * @param index Optional flow index to open
	 */
	open(index?: number): void;

	/**
	 * Close the dialog
	 */
	close(): void;

	/**
	 * Get or set an option
	 * @param key Option key
	 * @param value Option value (omit to get)
	 */
	option(key: string, value?: any): any;

	/**
	 * Set multiple options
	 * @param options Options object
	 */
	option(options: Partial<FlowDialogOptions>): void;

	/**
	 * Refresh options and update dialog
	 * @param fromFlow Internal parameter
	 */
	refreshOptions(fromFlow?: boolean): void;

	/**
	 * Reposition the dialog
	 */
	reposition(): void;

	/**
	 * Flow to a specific index
	 * @param index Flow index
	 * @returns Promise that resolves when flow is complete
	 */
	flowTo(index: number): Promise<void>;

	/**
	 * Flow navigation
	 * @param cmd Command ('next', 'prev', or 'index')
	 * @param index Index for 'index' command
	 */
	flow(cmd: 'next' | 'prev'): void;
	flow(cmd: 'index'): number;
	flow(cmd: 'index', index: number): void;

	/**
	 * Add event listener
	 * @param event Event name
	 * @param handler Event handler
	 */
	on(event: string, handler: FlowDialogEventHandler): void;

	/**
	 * Remove event listener
	 * @param event Event name
	 * @param handler Event handler (omit to remove all)
	 */
	off(event: string, handler?: FlowDialogEventHandler): void;

	/**
	 * Destroy the dialog and clean up
	 */
	destroy(): void;
}

export default FlowDialog;
