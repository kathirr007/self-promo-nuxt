<template>
  <section class="hero is-success">
    <div v-if="!production" class="hero-body p-4">
      <div class="container has-text-centered">
        <div class="column is-6 is-offset-3 px-0">
          <h3 class="title has-text-grey">Register</h3>
          <p class="subtitle has-text-grey">Please register to proceed.</p>
          <div class="box">
            <figure class="avatar">
              <!-- <img src="https://via.placeholder.com/300"> -->
              <img
                :src="
                  form.avatar ? form.avatar : 'https://via.placeholder.com/300'
                "
              />
            </figure>
            <form class="mt-3">
              <div class="field">
                <div class="control">
                  <input
                    @blur="$v.form.username.$touch()"
                    @keyup.enter="$v.form.username.$touch()"
                    v-model="form.username"
                    class="input"
                    type="text"
                    placeholder="Username"
                  />
                  <div v-if="$v.form.username.$error" class="form-error">
                    <span
                      v-if="!$v.form.username.required"
                      class="help is-danger"
                    >Username is required</span>
                    <span
                      v-if="!$v.form.username.minLength"
                      class="help is-danger"
                    >Username minimum length is 6 characters</span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    @blur="$v.form.name.$touch()"
                    @keyup.enter="$v.form.name.$touch()"
                    v-model="form.name"
                    class="input"
                    type="text"
                    placeholder="Name"
                  />
                  <div v-if="$v.form.name.$error" class="form-error">
                    <span v-if="!$v.form.name.required" class="help is-danger">Name is required</span>
                    <span
                      v-if="!$v.form.name.minLength"
                      class="help is-danger"
                    >Name minimum length is 6 characters</span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    @blur="$v.form.email.$touch()"
                    @keyup.enter="$v.form.email.$touch()"
                    v-model="form.email"
                    class="input"
                    type="email"
                    placeholder="Your Email"
                  />
                  <div v-if="$v.form.email.$error" class="form-error">
                    <span v-if="!$v.form.email.required" class="help is-danger">Email is required</span>
                    <span
                      v-if="!$v.form.email.emailValidator"
                      class="help is-danger"
                    >Email address is not valid</span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    @blur="$v.form.avatar.$touch()"
                    @keyup.enter="$v.form.avatar.$touch()"
                    v-model="form.avatar"
                    class="input"
                    type="text"
                    placeholder="Avatar"
                    autocomplete
                  />
                  <div v-if="$v.form.avatar.$error" class="form-error">
                    <span v-if="!$v.form.avatar.url" class="help is-danger">Url format is not valid!</span>
                    <span
                      v-if="!$v.form.avatar.supportedFileTypes"
                      class="help is-danger"
                    >Selected file type is not valid!</span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    @blur="$v.form.password.$touch()"
                    @keyup.enter="$v.form.password.$touch()"
                    v-model="form.password"
                    class="input"
                    type="password"
                    placeholder="Your Password"
                    autocomplete="new-password"
                  />
                  <div v-if="$v.form.password.$error" class="form-error">
                    <span
                      v-if="!$v.form.password.required"
                      class="help is-danger"
                    >Password is required</span>
                    <span
                      v-if="!$v.form.password.minLength"
                      class="help is-danger"
                    >Password minimum length is 6 letters</span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    @blur="$v.form.passwordConfirmation.$touch()"
                    @keyup.enter="$v.form.passwordConfirmation.$touch()"
                    v-model="form.passwordConfirmation"
                    class="input"
                    type="password"
                    placeholder="Password Confirmation"
                    autocomplete="off"
                  />
                  <div v-if="$v.form.passwordConfirmation.$error" class="form-error">
                    <span
                      v-if="!$v.form.passwordConfirmation.required"
                      class="help is-danger"
                    >Confirm Password is required</span>
                    <span
                      v-if="!$v.form.passwordConfirmation.sameAs"
                      class="help is-danger"
                    >Confirm Password should be the same as password</span>
                  </div>
                </div>
              </div>
              <button
                :disabled="$v.form.$invalid"
                @click.prevent="register"
                type="submit"
                class="button is-block is-info is-fullwidth"
              >Register</button>
            </form>
          </div>
          <p class="has-text-grey has-text-centered">
            <span class="is-block">Already you have account?</span>
            <nuxt-link to="/login" class="mr-2">Login</nuxt-link>
            <!-- <a>Sign Up With Google</a> &nbsp;·&nbsp; -->
            <!-- <a href="../">Need Help?</a> -->
            <!-- &nbsp;·&nbsp;
            <a @click="signInWithGoogle">Sign In With Google</a>-->
          </p>
        </div>
      </div>
    </div>
    <div v-else class="hero-body">
      <p class="has-text-centered has-text-black">
        Hello, You are not allowed to register. Registration is only for
        Development purpose.
      </p>
      <p class="has-text-centered has-text-black">
        Please contact
        <a href="mailto:kathirr007@gmail.com">Administrator</a>
      </p>
    </div>
  </section>
</template>

<script>
import {
  required,
  minLength,
  email,
  url,
  sameAs,
} from "vuelidate/lib/validators";
import { supportedFileTypes } from "@/helpers/validators";
export default {
  middleware: "guest",
  data() {
    return {
      form: {
        username: null,
        name: null,
        avatar: null,
        email: null,
        password: null,
        passwordConfirmation: null,
      },
      production: process.client
        ? window.location.hostname === "localhost"
          ? false
          : true
        : false,
    };
  },
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(6),
      },
      name: {
        required,
        minLength: minLength(6),
      },
      avatar: {
        url,
        supportedFileTypes,
      },
      email: {
        required,
        emailValidator: email,
      },
      password: {
        required,
        minLength: minLength(6),
      },
      passwordConfirmation: {
        required,
        sameAs: sameAs("password"),
      },
    },
  },
  computed: {
    isFormValid() {
      return !this.$v.form.$invalid;
    },
  },
  methods: {
    register() {
      // console.log(this.form)
      this.$v.form.$touch();
      if (this.isFormValid) {
        this.$store
          .dispatch("authentication/register", this.form)
          .then(() => this.$router.push("/login"))
          .catch((error) => this.$toasted.error(error, { duration: 3000 }));
      }
    },
    async signInWithGoogle() {
      // debugger
      await this.$auth
        .loginWith("google")
        .then(() => {
          // debugger
          this.$toasted.success("Logged In!", { duration: 5000 });
        })
        .catch((e) => {
          this.$toast.show("Error", { icon: "fingerprint" });
        });
    },
  },
};
</script>

<style scoped>
.hero.is-success {
  background: #f2f6fa;
}
.hero .nav,
.hero.is-success .nav {
  -webkit-box-shadow: none;
  box-shadow: none;
}

.avatar {
  margin-top: -70px;
  padding-bottom: 20px;
}
.avatar img {
  height: 128px;
  width: 128px;
  padding: 5px;
  background: #fff;
  border-radius: 50%;
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}
p.subtitle {
  padding-top: 1rem;
}
</style>
