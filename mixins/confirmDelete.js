import Vue from "vue";
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    capitalize(s) {
      if (typeof s !== "string") return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    confirmDelete(e, type, arg1) {
      if (e.target) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      // debugger
      let self = this;
      self.$vueConfirm.confirm(
        {
          auth: false,
          title: "Please Confirm",
          titleLevel: 2,
          message: `Are you sure? <br> You want to delete <br><strong>" ${arg1.title ||
            arg1.name} "</strong>`,
          button: {
            no: "No",
            yes: "Yes"
          }
        },
        function(confirm) {
          if (confirm == true) {
            // ... do some thing
            console.log("Dispatching delete...");
            // debugger
            self.$store
              .dispatch(`admin/${type}/delete${self.capitalize(type)}`, arg1)
              .then(_ =>
                self.$toasted.success(
                  `The ${self.capitalize(
                    type
                  )} <strong style="margin: 0 5px; display: inline-block;"> ${arg1.title ||
                    arg1.name} </strong> was deleted successfully..`,
                  { duration: 3500 }
                )
              );
          }
        }
      );
    }
  }
};
