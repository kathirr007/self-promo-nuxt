<template>
<div class="card manage-card">
    <header class="card-header card-section">
        <p class="card-header-title">Course Landing Page</p>
    </header>
    <div class="card-content card-section">
        <form>
            <div class="field">
                <label class="label">Course title</label>
                <div class="control">
                    <input :value="course.title" @input="($event) => emitCourseValue($event, 'title')" class="input" type="text" placeholder="Dart and Flutter From Zero to Hero ">
                </div>
            </div>
            <div class="field">
                <label class="label">Course subtitle</label>
                <div class="control">
                    <input :value="course.subtitle" @input="($event) => emitCourseValue($event, 'subtitle')" class="input " type="text" placeholder="Build real mobile Application for Android and iOS.">
                </div>
            </div>
            <div class="field">
                <label class="label">Course description</label>
                <div class="control">
                    <!-- <textarea
              :value="course.description"
              @input="($event) => emitCourseValue($event, 'description')"
              class="textarea "
              type="text"
              placeholder="Write something catchy about the course"
            >
            </textarea> -->
                    <course-editor @editorUpdated="(content) => emitCourseValue(content, 'description')" :initialContent="course.description" />
                </div>
            </div>
            <div class="field">
                <label class="label">Category</label>
                <div class="select ">
                    <select :value="course.category._id" @change="($event) => emitCourseValue($event, 'category')">
                        <!-- <option value="default">Select Category</option> -->
                        <option v-for="category in categories" :key="category._id" :value="category._id">{{category.name}}</option>
                    </select>
                </div>
            </div>
            <div class="field">
                <label class="label">Course Image</label>
                <div class="columns">
                    <!-- <div class="column">
                        <figure class="image is-4by2">
                            <img :src="course.image">
                        </figure>
                    </div> -->
                    <div class="column centered p-0">
                        <div class="control">
                            <input :value="course.image" @input="($event) => emitCourseValue($event, 'image')" class="input" type="text" placeholder="https://images.unsplash.com/photo-1498837167922-ddd27525d352">
                        </div>
                        <div class="file has-name is-fullwidth">
                            <label class="file-label">
                                <!-- <input @change="imagesAdd" class="file-input"  ref="imagesInput" multiple type="file" name="resume"> -->
                                <b-form-file @change="imagesAdd" @input="($event) => emitCourseValue($event, 'images')" :file-name-formatter="formatNames" ref="imagesInput" multiple id="productPhoto" title=" "></b-form-file>
                            </label>
                        </div>
                        <div class="uploaded-files is-justify-content-center is-flex is-flex-wrap-wrap p-2">
                            <div class="img-wrap p-2" v-for="(prodImage, index) in image" :key="index">
                              <img :src="prodImage" class="img-thumbnail">
                              <i @click="removeImage(index)" class="delete-img fas fa-times-circle"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <label class="label">Course Link</label>
                <div class="control">
                    <input :value="course.productLink" @input="($event) => emitCourseValue($event, 'productLink')" class="input " type="text" placeholder="https://www.udemy.com/vue-js-2-the-full-guide-by-real-apps-vuex-router-node">
                </div>
            </div>
            <div class="field">
                <label class="label">Course Video Link</label>
                <div class="control">
                    <input :value="course.promoVideoLink" @input="($event) => emitCourseValue($event, 'promoVideoLink')" class="input " type="text" placeholder="https://www.youtube.com/watch?v=WQ9sCAhRh1M">
                </div>
            </div>
        </form>
    </div>
</div>
</template>

<script>
import CourseEditor from '~/components/editor/CourseEditor'
import imgUploadMixin from '~/mixins/imgUpload'
import { BFormFile } from 'bootstrap-vue'
export default {
    props: {
        course: {
            type: Object,
            required: true
        }
    },
    mixins: [imgUploadMixin],
    components: {
        CourseEditor,
        BFormFile
    },
    computed: {
        categories() {
            return this.$store.state.category.items
        }
    },
    methods: {
      formatNames(files=[]) {
        // this.selectedFile = files[0]
        if(files.length == 0) {
          return "No file chosen"
        }
        if (files.length === 1) {
          return files[0].name
        } else {
          return `${files.length} files selected`
        }
      },
        emitCourseValue(e, field) {
            // const value = e.target.value
            const value = e.target ? e.target.value : e

            if (field === 'category') {
                return this.emitCategory(value, field)
            }

            return this.$emit('courseValueUpdated', {
                value,
                field
            })
        },
        emitCategory(categoryId, field) {
            const foundCategory = this.categories.find(c => c._id === categoryId)
            this.$emit('courseValueUpdated', {
                value: foundCategory,
                field
            })
        }
    }
}
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
  .img-wrap{
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
      color:unset !important;
      transition: color .2s ease-in;
      &:hover {
        color: orangered !important;
      }
    }
  }
}
</style>
