import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Warning from '@editorjs/warning';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import Image from '@editorjs/image';
import Raw from '@editorjs/raw';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import SimpleImage from '@editorjs/simple-image';

export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: Table,
  list: List,
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: {
    class: Image,
    config: {
      uploader: {
        /**
         * Mock uploader (stores images as Base64)
         * Replace this with a real backend API in production
         */
        uploadByFile(file) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                success: 1,
                file: {
                  url: e.target.result, // Base64-encoded image
                },
              });
            };
            reader.readAsDataURL(file);
          });
        },

        /**
         * Optional: Handle pasted image URLs
         */
        uploadByUrl(url) {
          return Promise.resolve({
            success: 1,
            file: {
              url: url,
            },
          });
        },
      },
    },
  },
  raw: Raw,
  header: {
    class: Header,
    config: {
      placeholder: 'Enter a header',
      levels: [2, 3, 4], // Only allow H2, H3, H4
      defaultLevel: 2, // Default to H2
    },
  },
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
};