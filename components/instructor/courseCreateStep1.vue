<template>
  <div class="course-create-wrapper">
    <div class="course-create-headerText">
      Please choose title of your Course.
    </div>
    <h2 class="course-create-subtitle">
      No worries, you can change title later.
    </h2>
    <form @input="emitFormData" class="course-create-form">
      <div class="course-create-form-group">
        <div class="field course-create-form-field control has-icons-right">
          <!-- <input
            @input="emitFormData"
            @blur="$v.form.title.$touch()"
            v-model="form.title"
            :maxLength="50"
            type="text"
            placeholder="e.g. Amazing Course in Flutter!"
            class="input is-large"
          > -->
          <text-input-with-count
            @blur="$v.form.title.$touch()"
            v-model="form.title"
            :v="$v.form.title"
            :maxLength="50"
          />
          <div v-if="$v.form.title.$error" class="form-error">
            <span v-if="!$v.form.title.required" class="help is-danger">Title is required</span>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import {required, maxLength} from 'vuelidate/lib/validators'
  import textInputWithCount from '~/components/form/textInputWithCount'
  export default {
    data() {
      return {
        form: {
          title: ''
        }
      }
    },
    components:{
      textInputWithCount
    },
    validations: {
      form: {
        title: {
          required,
          // maxLength: maxLength(50)
        }
      }
    },
    computed: {
      isValid() {
        return !this.$v.$invalid
      }
    },
    methods: {
      emitFormData() {
        this.$emit('stepUpdated', {data: this.form, isValid: this.isValid})
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>