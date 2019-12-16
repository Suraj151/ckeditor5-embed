/**
 * @module embed/embedcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import {parseMediaEmbed, ensureSafeUrl} from './utils';

/**
 * The embed command.
 *
 * @extends module:core/command~Command
 */
export default class EmbedCommand extends Command {

	refresh() {
		const model = this.editor.model;
		const doc = model.document;

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
		Object.assign(embed_options.getEmbedAttributes(embed_Link)||{},attributesFromEmbed) : attributesFromEmbed;
		embedAttributes.src = ensureSafeUrl( embedAttributes.src );

		model.change( writer => {

			let	position = selection.getLastPosition();

			if ( embed_Link !== '' && position) {
				const embed = writer.createElement( 'embed', embedAttributes );
				writer.insert( embed, position );
			}

		} );
	}
}
