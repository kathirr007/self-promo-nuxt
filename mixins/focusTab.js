import ClickOutside from 'vue-click-outside'

export default {
  directives: {
    ClickOutside
  },
  data() {
    return {
      selectedItem: null
    };
  },
  computed: {},
  methods: {
    clearSelectedItem() {
      this.selectedItem = null;
    },
    handleTabKey(e, item) {
      if(this.selectedItem === null || this.selectedItem?._id !== item._id) {
        this.selectedItem = item
      }
    },
  }
};
