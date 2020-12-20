<template>
  <section class="hero is-success">
    <div class="hero-body p-4">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4 px-0">
          <h3 class="title has-text-grey">Reset Password</h3>
          <p class="subtitle has-text-grey">Please proceed to reset Password.</p>
          <div class="box">
            <!-- <figure class="avatar">
              <img src="https://via.placeholder.com/300" />
            </figure>-->
            <form>
              <!-- User email -->
              <div class="field">
                <div class="control">
                  <input
                    @blur="$v.form.email.$touch()"
                    @keyup.enter="$v.form.email.$touch()"
                    v-model="form.email"
                    class="input"
                    type="email"
                    placeholder="Your Email"
                    autofocus
                    autocomplete="email"
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
              <!-- Old Password -->
              <div class="field">
                <div class="control">
                  <input
                    @blur="$v.form.oldPassword.$touch()"
                    @keyup.enter="$v.form.oldPassword.$touch()"
                    v-model="form.oldPassword"
                    class="input"
                    type="password"
                    placeholder="Your Password"
                    autocomplete="current-password"
                  />
                  <div v-if="$v.form.oldPassword.$error" class="form-error">
                    <span
                      v-if="!$v.form.oldPassword.required"
                      class="help is-danger"
                    >Password is required</span>
                    <span
                      v-if="!$v.form.oldPassword.minLength"
                      class="help is-danger"
                    >Password should be minimum 6 characters</span>
                  </div>
                </div>
              </div>
              <!-- New password -->
              <div class="field">
                <div class="control">
                  <input
                    @blur="$v.form.newPassword.$touch()"
                    @keyup.enter="$v.form.newPassword.$touch()"
                    v-model="form.newPassword"
                    class="input"
                    type="password"
                    placeholder="Your Password"
                    autocomplete="current-password"
                  />
                  <div v-if="$v.form.newPassword.$error" class="form-error">
                    <span
                      v-if="!$v.form.newPassword.required"
                      class="help is-danger"
                    >New Password is required</span>
                    <span
                      v-if="!$v.form.newPassword.minLength"
                      class="help is-danger"
                    >New Password should be minimum 6 characters</span>
                  </div>
                </div>
              </div>
              <!-- Confirm Password -->
              <div class="field">
                <div class="control">
                  <input
                    @blur="$v.form.passwordConfirmation.$touch()"
                    @keyup.enter="$v.form.passwordConfirmation.$touch()"
                    v-model="form.passwordConfirmation"
                    class="input"
                    type="password"
                    placeholder="Your Password"
                    autocomplete="current-password"
                  />
                  <div v-if="$v.form.passwordConfirmation.$error" class="form-error">
                    <span
                      v-if="!$v.form.passwordConfirmation.required"
                      class="help is-danger"
                    >Confirm Password is required</span>
                    <span
                      v-if="!$v.form.passwordConfirmation.minLength"
                      class="help is-danger"
                    >Confirm Password should be match with New Password</span>
                  </div>
                </div>
              </div>
              <!-- Login Button -->
              <button
                @click.prevent="resetPassword"
                @keyup.enter="resetPassword"
                :disabled="$v.form.$invalid"
                class="button is-block is-info is-fullwidth"
              >Reset Password</button>
            </form>
          </div>
          <div class="has-text-grey">
            <!-- <client-only placeholder="Loading..."> -->
            <!-- <a @click="onSignIn">Sign In With Google</a> &nbsp;·&nbsp; -->
            <!-- </client-only> -->
            <div v-if="$auth.loggedIn">
              {{$auth.user.email}}
              <a class="button is-primary" @click.prevent="googleLogout">Logout</a>
            </div>
            <div v-else>
              <!-- <a @click="signInWithGoogle">Sign In With Google</a> &nbsp;·&nbsp; -->
              <p class="has-text-gray has-text-centered">Don't have account?</p>
              <nuxt-link to="/register">Sign Up</nuxt-link>
              <!-- &nbsp;·&nbsp;
              <a href="../">Need Help?</a>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* function onSignIn(googleUser) {
    debugger
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    debugger
    signOut()
  }

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {

    });
  } */

import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
export default {
  middleware: "guest",
  head: {
    meta: [
      {
        name: "google-signin-client_id",
        content:
          "952132017083-to68rg93dp9ao68ulhim23853vhc3hvq.apps.googleusercontent.com",
      },
    ],
    script: [
      {
        src: "https://apis.google.com/js/platform.js",
        crossorigin: "anonymous",
        async: true,
        defer: true,
      },
    ],
  },
  data() {
    return {
      form: {
        email: null,
        oldPassword: null,
        newPassword: null,
        passwordConfirmation: null,
      },
    };
  },
  validations: {
    form: {
      email: {
        emailValidator: email,
        required,
      },
      oldPassword: {
        required,
        minLength: minLength(6),
      },
      newPassword: {
        required,
        minLength: minLength(6),
      },
      passwordConfirmation: {
        required,
        sameAs: sameAs("newPassword"),
      },
    },
  },
  computed: {
    isFormValid() {
      return !this.$v.$invalid;
    },
  },
  methods: {
    resetPassword() {
      // console.log(this.form)
      this.$v.form.$touch();

      if (this.isFormValid) {
        this.$store
          .dispatch("authentication/resetPassword", this.form)
          .then(() => {
            this.$router.push("/login");
            this.$toasted.success(
              "Password is reseted Successfully, you can login with new Password",
              { duration: 3000 }
            );
          })
          .catch((err) =>
            this.$toasted.error("Wrong email or password doesn't match", {
              duration: 3000,
            })
          );
      }
    },
    onSignIn(googleUser) {
      // debugger
      var profile = googleUser.getBasicProfile();
      /* console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present. */
      // debugger
      // signOut()
    },
    signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {});
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