<template>
  <div class="card manage-card">
    <header class="card-header card-section">
      <h2 class="card-header-title">Project Landing Page</h2>
    </header>
    <div class="card-content card-section">
      <form>
        <div class="field">
          <label class="label" for="ProjectTitle">Project title</label>
          <div class="control">
            <input
              id="ProjectTitle"
              :value="project.title"
              @input="$event => emitProjectValue($event, 'title', title)"
              class="input"
              type="text"
              placeholder="Amazing Project Title"
            />
            <div v-if="$v.title.$error" class="form-error">
              <span v-if="!$v.title.required" class="help is-danger"
                >Title is required</span
              >
              <span v-if="!$v.title.minLength" class="help is-danger"
                >Title should be minimum
                {{ $v.title.$params.minLength.min }} characters</span
              >
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label" for="ProjectSubtitle">Project subtitle</label>
          <div class="control">
            <input
              id="ProjectSubtitle"
              :value="project.subtitle !== 'undefined' ? project.subtitle : ''"
              @input="$event => emitProjectValue($event, 'subtitle')"
              class="input"
              type="text"
              placeholder="Awesome Project Subtitle"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Project description</label>
          <div class="control">
            <project-editor
              @editorUpdated="
                content => emitProjectValue(content, 'description')
              "
              :initialContent="project.description || ''"
            />
          </div>
        </div>
        <!-- <div class="field">
          <label class="label">Project description 2</label>
          <div class="control">
            <client-only>
              <quill-editor
                ref="editor"
                :options="editorOption"
                v-model="projectDescription"
                @input="onEditorInput($event)"
                data-lpignore="true"
              />
            </client-only>
          </div>
        </div>-->
        <div class="field">
          <label class="label" for="projectCategory">Category</label>
          <div class="select">
            <select
              id="projectCategory"
              :value="project.category._id"
              @change="$event => emitProjectValue($event, 'category')"
            >
              <!-- <option value="default">Select Category</option> -->
              <option
                v-for="category in categories"
                :key="category._id"
                :value="category._id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="field">
          <label class="label">Project Image</label>
          <div class="columns">
            <!-- <div class="column">
                        <figure class="image is-4by2">
                            <img :src="project.image">
                        </figure>
            </div>-->
            <div class="column centered p-0">
              <!-- <div class="control">
                            <input :value="project.image" @input="($event) => emitProjectValue($event, 'image')" class="input" type="text" placeholder="https://images.unsplash.com/photo-1498837167922-ddd27525d352">
              </div>-->
              <div class="file has-name is-fullwidth">
                <b-form-file
                  @change="imagesAdd"
                  @input="$event => emitProjectValue($event, 'images')"
                  :file-name-formatter="formatNames"
                  ref="imagesInput"
                  multiple
                  id="productPhoto"
                  title=" "
                ></b-form-file>
                <!-- <label for="productPhoto" class="file-label">
                  <input @change="imagesAdd" class="file-input"  ref="imagesInput" multiple type="file" name="resume">
                </label> -->
              </div>
              <div class="notification is-danger is-light my-2">
                Note: Uploading new images will replace the existing images
              </div>
              <!-- Uploaded images -->
              <div
                v-if="uploadedFiles.length !== 0 && images.length === undefined"
                class="uploaded-files is-justify-content-center is-flex is-flex-wrap-wrap p-2"
              >
                <div
                  class="img-wrap p-2"
                  v-for="(image, index) in uploadedFiles"
                  :key="index"
                >
                  <img
                    :src="image.location"
                    class="img-thumbnail multiple-images"
                    :alt="image.originalname.split('.')[0]"
                  />
                  <i
                    @click="removeS3Image(index, 'images')"
                    class="delete-img fas fa-times-circle"
                  ></i>
                </div>
              </div>
              <!-- <div v-else-if="project.image != ''" class="uploaded-files is-justify-content-center is-flex is-flex-wrap-wrap p-2">
                            <div class="img-wrap p-2">
                                <img :src="project.image" class="img-thumbnail single-image">
                            </div>
              </div>-->
              <div
                v-else
                class="uploaded-files is-justify-content-center is-flex is-flex-wrap-wrap p-2"
              >
                <div
                  class="img-wrap p-2"
                  v-for="(prodImage, index) in image"
                  :key="index"
                >
                  <img
                    :src="prodImage"
                    class="img-thumbnail"
                    :alt="`uploaded-file-${index + 1}`"
                  />
                  <i
                    @click="removeImage(index)"
                    class="delete-img fas fa-times-circle"
                  ></i>
                </div>
              </div>
              <!-- <b-row v-else align-v="center" class="uploaded-files">
                            <div class="img-wrap p-2" v-for="(prodImage, index) in image" :key="index">
                                <b-img thumbnail fluid :src="prodImage"></b-img>
                                <i @click="removeImage(index)" class="delete-img fas fa-times-circle"></i>
                            </div>
              </b-row>-->
              <!-- Uploaded images end -->
              <!-- <div class="uploaded-files is-justify-content-center is-flex is-flex-wrap-wrap p-2">
                            <div class="img-wrap p-2" v-for="(prodImage, index) in image" :key="index">
                              <img :src="prodImage" class="img-thumbnail">
                              <i @click="removeImage(index)" class="delete-img fas fa-times-circle"></i>
                            </div>
              </div>-->
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label" for="ProjectLink">Project Link</label>
          <div class="control">
            <input
              id="ProjectLink"
              :value="
                project.productLink !== 'undefined' ? project.productLink : ''
              "
              @input="$event => emitProjectValue($event, 'productLink')"
              class="input"
              type="text"
              placeholder="https://kathirr007-portfolio.herokuapp.com/"
            />
          </div>
        </div>
        <div class="field">
          <label class="label" for="ProjectRepositoryLink"
            >Project Repository Link</label
          >
          <div class="control">
            <input
              id="ProjectRepositoryLink"
              :value="
                project.promoVideoLink !== 'undefined'
                  ? project.promoVideoLink
                  : ''
              "
              @input="$event => emitProjectValue($event, 'promoVideoLink')"
              class="input"
              type="text"
              placeholder="https://kathirr007-portfolio.herokuapp.com/"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ProjectEditor from "~/components/editor/ProjectEditor";
import imgUploadMixin from "~/mixins/imgUpload";
import { BFormFile } from "bootstrap-vue";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  mixins: [imgUploadMixin],
  components: {
    ProjectEditor,
    BFormFile
  },
  data() {
    return {
      uploadedFiles: [],
      projectDescription: ""
    };
  },
  validations: {
    title: {
      required,
      minLength: minLength(10)
    }
  },
  computed: {
    categories() {
      return this.$store.state.category.items;
    },
    title() {
      return this.project.title;
    },
    description: {
      get() {
        return this.project.description;
      },
      set(v) {
        this.project.description = v;
      }
    }
  },
  mounted() {
    if (
      this.project.images[0] != undefined &&
      typeof this.project.images[0]["location"] !== "undefined"
    ) {
      this.uploadedFiles = this.project.images;
    } else {
      this.uploadedFiles = [];
    }
    // this.mergedFiles.push(...this.uploadedFiles)
    // this.category = this.project.category != null ? this.project.category._id : ''
    // this.owner = this.project.owner != null ? this.project.owner._id : ''
    this.$v.title.$touch();
    this.projectDescription = this.project.description;
  },
  methods: {
    formatNames(files = []) {
      // this.selectedFile = files[0]
      if (files.length == 0) {
        return "No file chosen";
      }
      if (files.length === 1) {
        return files[0].name;
      } else {
        return `${files.length} files selected`;
      }
    },
    deleteImage(params) {
      debugger;
      s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
        // error
        else console.log("Image deleted..."); // deleted
      });
    },
    removeS3Image(index, field) {
      // this.uploadedFiles.splice(key, 1);
      const value = this.uploadedFiles;
      // let img2Delete = this.uploadedFiles[index].location.split('/')
      let key = this.uploadedFiles[index].location.split("/").pop();
      let s3Key = this.uploadedFiles[index].location
        .split("/")
        .splice(3)
        .join("/");
      let imgName = this.uploadedFiles[index].originalname;
      // let params = {  Bucket: 'kathirr007-portfolio', Key: `projects/${key}` }
      debugger;
      this.$store
        .dispatch(`admin/project/deleteProjectImage`, { key, index, s3Key })
        .then(_ =>
          this.$toasted.success(
            `The Product Image <strong class="mx-2 has-text-white"> ${imgName} </strong> was deleted successfully..`,
            { duration: 3500 }
          )
        )
        .then(_ => {
          return this.$emit("projectImageUpdated", {
            index,
            field
          });
        });
      // this.deleteImage(params)
      // this.$store.dispatch('admin/project/updateCanUpdate')
    },
    emitProjectValue(e, field, title = "") {
      // const value = e.target.value
      // debugger;
      const value = e.target ? e.target.value : e;
      let oldValue = [];
      if (field === "title") {
        this.$v.title.$touch();
      }

      if (field === "category") {
        return this.emitCategory(value, field);
      }
      // debugger
      if (field === "images" && this.uploadedFiles.length !== 0) {
        this.$store.dispatch(
          "admin/project/updateUploadedFiles",
          this.uploadedFiles
        );
      }
      return this.$emit("projectValueUpdated", {
        value,
        field,
        title
      });
    },
    emitCategory(categoryId, field) {
      const foundCategory = this.categories.find(c => c._id === categoryId);
      this.$emit("projectValueUpdated", {
        value: foundCategory,
        field
      });
    },
    emitImages(oldValue, value, field) {
      this.$emit("projectImagesUpdated", {
        oldValue,
        value,
        field
      });
    }
  }
};
</script>

<style lang="scss">
.custom-file {
  position: relative;
  display: inline-block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  margin-bottom: 0;
}
.custom-file-input {
  position: relative;
  z-index: 2;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  margin: 0;
  opacity: 0;
}
.custom-file-label {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  &:after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    display: block;
    height: calc(1.5em + 0.75rem);
    padding: 0.375rem 0.75rem;
    line-height: 1.5;
    color: #495057;
    content: "Browse";
    background-color: #e9ecef;
    border-left: inherit;
    border-radius: 0 0.25rem 0.25rem 0;
  }
}
</style>

<style lang="scss" scoped>
.uploaded-files {
  .img-wrap {
    position: relative;
    width: 25%;
    .img-thumbnail {
      padding: 1rem;
      background-color: #fff;
      border: 1px solid #dee2e6;
      border-radius: 0.25rem;
      max-width: 100%;
      height: auto;
    }
    .delete-img.fas {
      position: absolute;
      right: 5px;
      top: 0px;
      cursor: pointer;
      font-size: 18px !important;
      color: unset !important;
      transition: color 0.2s ease-in;
      &:hover {
        color: orangered !important;
      }
    }
  }
}
</style>
