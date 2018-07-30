
/**
 * @module embed/embedui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import Range from '@ckeditor/ckeditor5-engine/src/view/range';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';

import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import EmbedFormView from './ui/embedformview';

import mediaIcon from '../theme/icons/media.svg';

const embedKeystroke = 'Ctrl+Shift+K';

/**
 * The embed UI plugin. It introduces the embed button and the <kbd>Ctrl+Shift+K</kbd> keystroke.
 *
 * @extends module:core/plugin~Plugin
 */
export default class EmbedUI extends Plugin {

	static get requires() {
		return [ ContextualBalloon ];
	}


	init() {
		const editor = this.editor;

		editor.editing.view.addObserver( ClickObserver );

		/**
		 * The form view displayed inside the balloon.
		 */
		this.formView = this._createFormView();

		/**
		 * The contextual balloon plugin instance.
		 */
		this._balloon = editor.plugins.get( ContextualBalloon );

		// Create toolbar buttons.
		this._createToolbarEmbedButton();

		// Attach lifecycle actions to the the balloon.
		this._enableUserBalloonInteractions();
	}

	/**
	 * Creates the embedFormView instance.
	 * @returns embed form instance.
	 */
	_createFormView() {
		const editor = this.editor;
		const formView = new EmbedFormView( editor.locale );
		const embedCommand = editor.commands.get( 'embed' );

		formView.saveButtonView.bind( 'isEnabled' ).to( embedCommand );

		// Execute embed command after clicking the "Save" button.
		this.listenTo( formView, 'submit', () => {
			editor.execute( 'embed', formView.urlInputView.inputView.element.value );
			this._removeFormView();
		} );

		// Hide the panel after clicking the "Cancel" button.
		this.listenTo( formView, 'cancel', () => {
			this._removeFormView();
		} );

		// Close the panel on esc key press when the **form has focus**.
		formView.keystrokes.set( 'Esc', ( data, cancel ) => {
			this._removeFormView();
			cancel();
		} );

		return formView;
	}

	/**
	 * Creates a toolbar embed button. Clicking this button will show
	 */
	_createToolbarEmbedButton() {
		const editor = this.editor;
		const embedCommand = editor.commands.get( 'embed' );
		const t = editor.t;

		// Handle the `Ctrl+Shift+K` keystroke and show the panel.
		editor.keystrokes.set( embedKeystroke, ( keyEvtData, cancel ) => {
			// Prevent focusing the search bar in FF and opening new tab in Edge. @ckeditor5-link #153, #154.
			cancel();

			if ( embedCommand.isEnabled ) {
				this._showUI();
			}
		} );

		editor.ui.componentFactory.add( 'embed', locale => {
			const button = new ButtonView( locale );

			button.isEnabled = true;
			button.label = t( 'Embed' );
			button.icon = mediaIcon;
			button.keystroke = embedKeystroke;
			button.tooltip = true;

			// Bind button to the command.
			button.bind( 'isEnabled' ).to( embedCommand, 'isEnabled' );

			// Show the panel on button click.
			this.listenTo( button, 'execute', () => this._showUI() );

			return button;
		} );
	}

	/**
	 * Attaches actions that control whether the balloon panel containing the
	 */
	_enableUserBalloonInteractions() {
		const viewDocument = this.editor.editing.view.document;

		// Close the panel on the Esc key press when the editable has focus and the balloon is visible.
		this.editor.keystrokes.set( 'Esc', ( data, cancel ) => {
			if ( this._isUIVisible ) {
				this._hideUI();
				cancel();
			}
		} );

		// Close on click outside of balloon panel element.
		clickOutsideHandler( {
			emitter: this.formView,
			activator: () => this._isUIVisible,
			contextElements: [ this._balloon.view.element ],
			callback: () => this._hideUI()
		} );
	}


	/**
	 * Adds the formView to the _balloon.
	 */
	_addFormView() {
		if ( this._isFormInPanel ) {
			return;
		}

		const editor = this.editor;
		const embedCommand = editor.commands.get( 'embed' );

		this._balloon.add( {
			view: this.formView,
			position: this._getBalloonPositionData()
		} );

		this.formView.urlInputView.select();
		this.formView.urlInputView.inputView.element.value = '';
	}

	/**
	 * Removes the formView from the _balloon.
	 */
	_removeFormView() {
		if ( this._isFormInPanel ) {
			this._balloon.remove( this.formView );

			// Because the form has an input which has focus, the focus must be brought back
			// to the editor. Otherwise, it would be lost.
			this.editor.editing.view.focus();
		}
	}

	/**
	 * Shows the UI.
	 */
	_showUI() {
		const editor = this.editor;
		const embedCommand = editor.commands.get( 'embed' );

		if ( !embedCommand.isEnabled ) {
			return;
		}

		this._addFormView();
	}

	/**
	 * Removes the formView from the _balloon.
	 */
	_hideUI() {
		if ( !this._isUIInPanel ) {
			return;
		}

		const editor = this.editor;

		this.stopListening( editor.ui, 'update' );

		// Remove form first because it's on top of the stack.
		this._removeFormView();

		// Make sure the focus always gets back to the editable.
		editor.editing.view.focus();
	}


	/**
	 * Returns true when formView is in the _balloon.
	 */
	get _isFormInPanel() {
		return this._balloon.hasView( this.formView );
	}

	/**
	 * Returns true when formView is in the _balloon.
	 */
	get _isUIInPanel() {
		return this._isFormInPanel ;
	}

	/**
	 * Returns true when formView is in the _balloon and it is
	 */
	get _isUIVisible() {
		return this._balloon.visibleView == this.formView ;
	}

	/**
	 * Returns positioning options for the {@embed #_balloon}. They control the way the balloon is attached
	 * to the target element or selection.
	 *
	 * If the selection is collapsed and inside a embed element, the panel will be attached to the
	 * entire embed element. Otherwise, it will be attached to the selection.
	 */
	_getBalloonPositionData() {
		const view = this.editor.editing.view;
		const viewDocument = view.document;

		const target = view.domConverter.viewRangeToDom( viewDocument.selection.getFirstRange() );
		return { target };
	}

}
