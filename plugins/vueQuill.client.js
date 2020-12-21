import Vue from "vue";
import VueQuillEditor from "vue-quill-editor";
// import { quillEditor } from "vue-quill-editor/dist/ssr";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

const defaultOptions = {
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      ["clean"],
      ["link"]
    ]
  },
  placeholder: "Global placeholder..."
};

Vue.use(VueQuillEditor, defaultOptions);
// Vue.use(quillEditor);
