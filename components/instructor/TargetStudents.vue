<template>
  <div class="card manage-card">
    <header class="card-header card-section">
      <p class="card-header-title">Target your Students</p>
    </header>
    <div class="card-content card-section">
      <form>
        <multi-line-text-input
          :lines="course.wsl"
          @valueUpdated="updateLine($event, 'wsl')"
          @addClicked="addLine('wsl')"
          @removeClicked="removeLine($event, 'wsl')"
          label="What will students learn"
        />
        <multi-line-text-input
          :lines="course.requirements"
          @valueUpdated="updateLine($event, 'requirements')"
          @addClicked="addLine('requirements')"
          @removeClicked="removeLine($event, 'requirements')"
          label="What are the requirements"
        />
      </form>
    </div>
  </div>
</template>

<script>
  import MultiLineTextInput from '~/components/form/MultiLineTextInput'
  export default {
    components: {
      MultiLineTextInput
    },
    props: {
      course: {
        type: Object,
        required: true
      }
    },
    methods: {
      addLine(field) {
        console.log('Adding line for: ', field)
        this.$store.commit('instructor/course/addLine', field)
      },
      removeLine(index, field) {
        console.log('Removing line from: ', field)
        console.log('Removing line of index: ', index)
        this.$store.commit('instructor/course/removeLine', {field, index})
      },
      updateLine({value, index}, field) {
        this.$store.dispatch('instructor/course/updateLine', {field, value, index})
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>