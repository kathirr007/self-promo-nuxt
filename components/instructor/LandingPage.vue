<template>
<div class="card manage-card">
    <header class="card-header card-section">
        <p class="card-header-title">Project Landing Page</p>
    </header>
    <div class="card-content card-section">
        <form>
            <div class="field">
                <label class="label">Project title</label>
                <div class="control">
                    <input :value="course.title" @input="($event) => emitCourseValue($event, 'title')" class="input" type="text" placeholder="Amazing Project Title">
                    <div v-if="$v.title.$error" class="form-error">
                    <span v-if="!$v.title.required" class="help is-danger">Title is required</span>
                    <span v-if="!$v.title.minLength" class="help is-danger">Title should be minimum 10 characters</span>
                  </div>
                </div>
            </div>
            <div class="field">
                <label class="label">Project subtitle</label>
                <div class="control">
                    <input :value="course.subtitle" @input="($event) => emitCourseValue($event, 'subtitle')" class="input " type="text" placeholder="Awesome Project Subtitle">
                </div>
            </div>
            <div class="field">
                <label class="label">Project description</label>
                <div class="control">
                    <!-- <textarea
              :value="course.description"
              @input="($event) => emitCourseValue($event, 'description')"
              class="textarea "
              type="text"
              placeholder="Write something catchy about the course"
            >
            </textarea> -->
                    <course-editor @editorUpdated="(content) => emitCourseValue(content, 'description')" :initialContent="course.description ? course.description :''" />
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
                <label class="label">Project Image</label>
                <div class="columns">
                    <!-- <div class="column">
                        <figure class="image is-4by2">
                            <img :src="course.image">
                        </figure>
                    </div> -->
                    <div class="column centered p-0">
                        <!-- <div class="control">
                            <input :value="course.image" @input="($event) => emitCourseValue($event, 'image')" class="input" type="text" placeholder="https://images.unsplash.com/photo-1498837167922-ddd27525d352">
                        </div> -->
                        <div class="file has-name is-fullwidth">
                            <label class="file-label">
                                <!-- <input @change="imagesAdd" class="file-input"  ref="imagesInput" multiple type="file" name="resume"> -->
                                <b-form-file @change="imagesAdd" @input="($event) => emitCourseValue($event, 'images')" :file-name-formatter="formatNames" ref="imagesInput" multiple id="productPhoto" title=" "></b-form-file>
                            </label>
                        </div>
                        <div class="notification is-danger is-light my-2">
                          Note: Uploading new images will replace the existing images
                        </div>
                         <!-- Uploaded images -->
                         <div v-if="uploadedFiles.length !==0" class="uploaded-files is-justify-content-center is-flex is-flex-wrap-wrap p-2">
                            <div class="img-wrap p-2" v-for="(image, index) in uploadedFiles" :key="index">
                                <img :src="image.location" class="img-thumbnail multiple-images">
                                <i @click="removeS3Image(index, 'images')" class="delete-img fas fa-times-circle"></i>
                            </div>
                        </div>
                        <!-- <div v-else-if="course.image != ''" class="uploaded-files is-justify-content-center is-flex is-flex-wrap-wrap p-2">
                            <div class="img-wrap p-2">
                                <img :src="course.image" class="img-thumbnail single-image">
                            </div>
                        </div> -->
                        <div v-else class="uploaded-files is-justify-content-center is-flex is-flex-wrap-wrap p-2">
                            <div class="img-wrap p-2" v-for="(prodImage, index) in image" :key="index">
                              <img :src="prodImage" class="img-thumbnail">
                              <i @click="removeImage(index)" class="delete-img fas fa-times-circle"></i>
                            </div>
                        </div>
                        <!-- <b-row v-else align-v="center" class="uploaded-files">
                            <div class="img-wrap p-2" v-for="(prodImage, index) in image" :key="index">
                                <b-img thumbnail fluid :src="prodImage"></b-img>
                                <i @click="removeImage(index)" class="delete-img fas fa-times-circle"></i>
                            </div>
                        </b-row> -->
                        <!-- Uploaded images end -->
                        <!-- <div class="uploaded-files is-justify-content-center is-flex is-flex-wrap-wrap p-2">
                            <div class="img-wrap p-2" v-for="(prodImage, index) in image" :key="index">
                              <img :src="prodImage" class="img-thumbnail">
                              <i @click="removeImage(index)" class="delete-img fas fa-times-circle"></i>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="field">
                <label class="label">Project Link</label>
                <div class="control">
                    <input :value="course.productLink !== 'undefined' ? course.productLink : ''" @input="($event) => emitCourseValue($event, 'productLink')" class="input " type="text" placeholder="https://kathirr007-portfolio.herokuapp.com/">
                </div>
            </div>
            <div class="field">
                <label class="label">Project Repository Link</label>
                <div class="control">
                    <input :value="course.promoVideoLink !== 'undefined' ? course.promoVideoLink : ''" @input="($event) => emitCourseValue($event, 'promoVideoLink')" class="input " type="text" placeholder="https://kathirr007-portfolio.herokuapp.com/">
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
import { required, minLength } from 'vuelidate/lib/validators'

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
    data() {
      return {
        uploadedFiles: [],
        title: ''
      }
    },
    validations: {
      title: {
        required,
        minLength: minLength(10)
      },
    },
    computed: {
        categories() {
            return this.$store.state.category.items
        }
    },
    mounted() {
      this.uploadedFiles = this.course.images
      // this.mergedFiles.push(...this.uploadedFiles)
      // this.category = this.course.category != null ? this.course.category._id : ''
      // this.owner = this.course.owner != null ? this.course.owner._id : ''
    },
    methods: {
        formatNames(files = []) {
          // this.selectedFile = files[0]
          if (files.length == 0) {
            return "No file chosen"
          }
          if (files.length === 1) {
            return files[0].name
          } else {
            return `${files.length} files selected`
          }
        },
        deleteImage(params)  {
          debugger
          s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack);  // error
            else     console.log('Image deleted...');                 // deleted
          });
        },
        removeS3Image(index, field) {
          // this.uploadedFiles.splice(key, 1);
          const value = this.uploadedFiles
          // let img2Delete = this.uploadedFiles[index].location.split('/')
          let key = this.uploadedFiles[index].location.split('/').pop()
          let s3Key = this.uploadedFiles[index].location.split('/').splice(3).join('/')
          let imgName = this.uploadedFiles[index].originalname
          // let params = {  Bucket: 'kathirr007-portfolio', Key: `projects/${key}` }
          debugger
          this.$store.dispatch(`instructor/course/deleteCourseImage`, {key, index, s3Key})
                  .then(_ =>
                    this.$toasted.success(`The Product Image <strong class="mx-2 has-text-white"> ${imgName} </strong> was deleted successfully..`, {duration: 3500}))
                  .then(_ => {
                    return this.$emit('courseImageUpdated', {
                      index,
                      field
                    })
                  })
          // this.deleteImage(params)
          // this.$store.dispatch('instructor/course/updateCanUpdate')
        },
        emitCourseValue(e, field) {
            // const value = e.target.value
            const value = e.target ? e.target.value : e
            // debugger
            if (field === 'title') {
              this.title = value
              this.$v.title.$touch()
            }


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
