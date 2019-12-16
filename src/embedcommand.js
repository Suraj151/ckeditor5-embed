/**
 * @module embed/embedcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';
import {parseMediaEmbed, ensureSafeUrl} from './utils';

/**
 * The embed command.
 *
 * @extends module:core/command~Command
 */
export default class EmbedCommand extends Command {

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const schema = model.schema;
		const position = selection.getFirstPosition();
		const selectedElement = selection.getSelectedElement();

		// if ( selectedElement && selectedElement.is( 'media' ) ) {
		// }
		let parent = position.parent;
		if ( parent != parent.root ) {
			parent = parent.parent;
		}

		// this.isEnabled = schema.checkChild( parent, 'media' );
		this.isEnabled = true;
	}

	/**
	 * Executes the command.
	 *
	 * @fires execute
	 * @param {String} link to embed
	 */
	execute( embed_Link ) {
		const model = this.editor.model;
		const embed_options = this.editor.config.get( 'embed' );
		const selection = model.document.selection;

		let attributesFromEmbed = parseMediaEmbed(embed_Link);
		let embedAttributes = embed_options&&embed_options.getEmbedAttributes ?
		Object.assign(attributesFromEmbed,embed_options.getEmbedAttributes(embed_Link)||{}) : attributesFromEmbed;
		embedAttributes.src = ensureSafeUrl( embedAttributes.src );
		embedAttributes = Object.assign(embedAttributes,{style: 'position:absolute;'});

		model.change( writer => {

			let	position = selection.getLastPosition();
			const insertPosition = findOptimalInsertionPosition( selection, model );

			if ( embed_Link !== '' && insertPosition) {
				const embedElement = writer.createElement( 'embed', embedAttributes );
				model.insertContent( embedElement, insertPosition );
				// writer.insert( embedElement, insertPosition );
				writer.setSelection( embedElement, 'on' );
			}

		} );
	}
}
