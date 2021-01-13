<template>
  <div class="project-create-wrapper">
    <div class="project-create-headerText">
      <template v-if="$route.params.id"
        >Please provide updated name of your Category.</template
      >
      <template v-else-if="$route.path.includes('categor')"
        >Please choose name of your Category.</template
      >
      <template v-else>Please choose title of your Project.</template>
    </div>
    <h2 class="project-create-subtitle">
      <template v-if="$route.params.id"
        >No worries, you can change name later again.</template
      >
      <template v-else-if="$route.path.includes('categor')"
        >No worries, you can change name later.</template
      >
      <template v-else>No worries, you can change title later.</template>
    </h2>
    <form
      @input="emitFormData"
      ref="categoryForm"
      @submit.prevent
      class="project-create-form"
    >
      <div class="project-create-form-group">
        <div
          class="field project-create-form-field control has-icons-right has-addons"
        >
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
            :category="category"
            v-model="form.title"
            :v="$v.form.title"
            :maxLength="100"
            @keydown.enter.prevent
            ref="textInputWithCount"
          />
          <button
            @click.prevent="emitFormData2"
            :class="
              $route.path.includes('categories') && isValid
                ? 'active m-l-md'
                : ''
            "
            class="create-category control is-large button is-success"
          >
            Create
          </button>
          <!-- <template></template> -->
        </div>
      </div>
      <div v-if="$v.form.title.$error" class="form-error">
        <span v-if="!$v.form.title.required" class="help is-danger"
          >Title is required</span
        >
        <span v-if="!$v.form.title.minLength" class="help is-danger"
          >Title should be minimum
          {{ $v.form.title.$params.minLength.min }} characters</span
        >
      </div>
    </form>
  </div>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import textInputWithCount from "~/components/form/textInputWithCount";
import { debug } from "util";
export default {
  data() {
    return {
      form: {
        title: "",
      },
    };
  },
  props: ["category", "canProceed"],
  components: {
    textInputWithCount,
  },
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(100),
      },
    },
  },
  computed: {
    isValid() {
      return !this.$v.$invalid;
    },
  },
  mounted() {
    // console.log(this.$route.path)
  },
  methods: {
    emitFormData() {
      // debugger
      this.$emit("stepUpdated", { data: this.form, isValid: this.isValid });
    },
    emitFormData2() {
      // debugger
      this.$emit("fromCategories", { data: this.form, isValid: this.isValid });
      this.$v.$reset();
      this.form.title = "";
      // this.$refs.textInputWithCount.currentValue = ''
      // this.$refs.textInputWithCount.$attrs.value = ''
      this.$refs.categoryForm.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
.create-category {
  opacity: 0;
  width: 0;
  padding: 0;
  transition: all 0.3s ease;
  &.active {
    opacity: 1;
    width: auto;
    padding: 0 1em;
  }
}
.project-create-form {
  .project-create-form-field {
    width: 100%;
  }
  margin-bottom: 15px;
  .form-error {
    text-align: left;
  }
}
</style>