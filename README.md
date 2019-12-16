# ckeditor5-embed
Embed youtube, vimeo videos links/embed-codes feature for CKEditor 5. https://ckeditor.com

This package implements the media embed link feature for CKEditor 5.

In this package i tried to implement embed link feature for CKEditor5 by refering CKEditor5 docs and their other packages.

**Example**

There are CKEditor5 Builds available on there official page as

Classic editor,
Inline editor,
Balloon editor,
Document editor

let assume Classic editor example

First, install the build from npm:

```bash
npm install --save @ckeditor/ckeditor5-build-classic
```

And use it in your website:

```html
<div id="editor">
	<p>This is the editor content.</p>
</div>
<script src="./node_modules/@ckeditor/ckeditor5-build-classic/build/ckeditor.js"></script>
<script>
	ClassicEditor
		.create( document.querySelector( '#editor' ) )
		.then( editor => {
			window.editor = editor;
		} )
		.catch( err => {
			console.error( err.stack );
		} );
</script>
```

Or in your JavaScript application:

```js
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Or using the CommonJS version:
// const ClassicEditor = require( '@ckeditor/ckeditor5-build-classic' );

ClassicEditor
	.create( document.querySelector( '#editor' ) )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
```

**Note:** If you are planning to integrate CKEditor 5 deep into your application, it is actually more convenient and recommended to install and import the source modules directly (like it happens in `ckeditor.js`). Read more in the [Advanced setup guide](https://docs.ckeditor.com/ckeditor5/latest/builds/guides/integration/advanced-setup.html).

**Including ckeditor5-embed with classic editor**

now install embed package

```bash
npm install ckeditor5-embed
```
open "ckeditor5-build-classic/src/ckeditor.js" source file where you can see imported packages.
now import ckeditor5-embed as shown in below example and build.

```js

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Embed from 'ckeditor5-embed/src/embed';

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Link,
  	Embed,
	List,
	Paragraph
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'imageUpload',
      			'embed',
			'blockQuote',
			'undo',
			'redo'
		]
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};

```
After build you can see media icon in your classic editor top bars.

you can paste youtube, vimeo link/embed-code there to embed it in your editor doc.

**Custom options**

you can use custom attribute option to add more type of embed cards in your application. just add embed config in your application while initializing editor

by default youtube and vimeo are only supported media to embed, with this option you can add more source of media using embed config callback setting. it will give you entered user link/embed-code in argument and you need to return the attribute object from user input that will fit to iframe

example

```html
<div id="editor">
	<p>This is the editor content.</p>
</div>
<script src="./node_modules/@ckeditor/ckeditor5-build-classic/build/ckeditor.js"></script>
<script>
	ClassicEditor
		.create( document.querySelector( '#editor' ),{
		
		embed:{
		  allowAttributes:['frameborder', 'allow', ....add more if any ],
		  getEmbedAttributes:( user_src )=>{
		    console.log("user entered this in embed : ", user_src);

		    //.....your logic to parse user input....
		    var _src = "https://somemedia.com/embed/xyz"	//parsed src attribute from user input
		    //.....your logic to parse user input....
		    
		    /* return attribute object. width(default=100%), height(default=100%), allowfullscreen(default=true) etc 
	attributes kept as default for better result, you can change it if needed */
		    return {
				src : _src, 	//this is must attribute as it is source of media
				//.....add more if any.
			};
		  }
		}
		} )
		.then( editor => {
			window.editor = editor;
		} )
		.catch( err => {
			console.error( err.stack );
		} );
</script>
```

**more:** other than videos we can embed custom embed-cards too.

for example,
```bash
<iframe width="100%" height="180" src="http://www.electronicwings.com/embed/code-repo/F1V8s024g0v3s1F7P3M7H3R8g090C0" class="ew_embed_iframe" frameborder="0" allowfullscreen=""/>
```


Help to imporove this as i am new to this platform.

Thank you.

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html). For full details about the license, please check the `LICENSE.md` file.
