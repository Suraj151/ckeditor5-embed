/**
 * @module embed/embedediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import EmbedCommand from './embedcommand';

/**
 * The embed engine feature.
 * @extends module:core/plugin~Plugin
 */
export default class EmbedEditing extends Plugin {

	init() {
		const editor = this.editor;

		editor.model.schema.register( 'embed', {
			isObject: true,
			isBlock: true,
			allowWhere: '$block',
			allowAttributes: [ 'width', 'height', 'src', 'frameborder', 'allow', 'allowfullscreen' ]
		} );

		editor.conversion.elementToElement( {
			model: 'embed',
			view: ( modelElement, viewWriter ) => {
				return viewWriter ? viewWriter.createEmptyElement( 'iframe', modelElement.getAttributes()):'';
			}
		} ) ;

		// Create embeding commands.
		editor.commands.add( 'embed', new EmbedCommand( editor ) );

	}

}
