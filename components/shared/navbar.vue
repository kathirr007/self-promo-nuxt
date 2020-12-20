<template>
  <nav class="navbar is-active is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <nuxt-link class="navbar-item" to="/">
        <h1 class="brand-title">Kathiravan K</h1>
        <figure class="image avatar is-48x48 m-r-sm">
          <img class="is-rounded" src="/profile-photo.jpg" />
        </figure>
      </nuxt-link>
      <!-- Adds click to open -->
      <!-- Adds active class -->
      <a
        @click="toggleNavbar"
        :class="{ 'is-active': isActive }"
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <!-- Adds active class -->
    <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': isActive }">
      <div class="navbar-start">
        <nav-link @click.native="toggleNavbar" to="/" class="navbar-item">Home</nav-link>
        <nav-link @click.native="toggleNavbar" to="/projects" class="navbar-item">Projects</nav-link>
        <!-- <nav-link @click.native="toggleNavbar" to="/instructor/courses" class="navbar-item">
          Courses
        </nav-link>-->
        <nav-link @click.native="toggleNavbar" to="/experiences" class="navbar-item">Experiences</nav-link>
        <nav-link @click.native="toggleNavbar" to="/about" class="navbar-item">About</nav-link>
        <nav-link @click.native="toggleNavbar" to="/cv" class="navbar-item">Cv</nav-link>
        <!-- <nav-link @click.native="toggleNavbar" to="/instructor" class="navbar-item">
          Instructor
        </nav-link>
        <nav-link @click.native="toggleNavbar" to="/secret" class="navbar-item">
          Secret
        </nav-link>-->
      </div>

      <client-only>
        <div class="navbar-end" v-if="!production">
          <div class="navbar-item">
            <div class="buttons">
              <!-- If Authenticated -->
              <template v-if="isAuth || isLoggedIn">
                <figure class="image avatar is-48x48 m-r-sm">
                  <img class="is-rounded" :src="user ? user.avatar : googleUserAvatar" />
                </figure>
                <div class="m-r-sm m-b-sm">Welcome {{ user ? user.username : googleUser }}!</div>
                <!-- If Admin -->
                <button
                  v-if="isAdmin"
                  class="button is-link is-outlined"
                  @click="$router.push('/instructor')"
                >Instructor</button>
                <a v-if="user" class="button is-primary" @click.prevent="logout">Logout</a>
                <a v-else class="button is-primary" @click.prevent="googleLogout">Logout</a>
              </template>
              <template v-else>
                <nav-link
                  @click.native="toggleNavbar"
                  to="/register"
                  class="button is-primary"
                >Sign up</nav-link>
                <nav-link @click.native="toggleNavbar" to="/login" class="button is-light">Log in</nav-link>
              </template>
            </div>
          </div>
        </div>
      </client-only>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  computed: {
    ...mapGetters({
      user: "authentication/authUser",
      isAuth: "authentication/isAuthenticated",
      isAdmin: "authentication/isAdmin",
    }),
    ...mapState({
      isLoggedIn: (state) => state.auth.loggedIn,
      googleUser: (state) => state.auth.user.name,
      googleUserAvatar: (state) => state.auth.user.picture,
    }),
    prodOnline(context) {
      return this.process.env.BASE_URL;
    },
  },
  data() {
    return {
      isActive: false,
      production: process.client
        ? window.location.hostname === "localhost"
          ? false
          : true
        : "",
    };
  },
  methods: {
    toggleNavbar() {
      this.isActive = !this.isActive;
    },
    logout() {
      this.$store
        .dispatch("authentication/logout", this.form)
        .then(() => {
          // this.$router.push('/')
          this.isActive = !this.isActive;
          this.$router.push("/login");
          this.$toasted.success("Successfully logged out...", {
            duration: 3000,
          });
        })
        .catch((err) =>
          this.$toasted.error("There is something wrong.. :(", {
            duration: 3000,
          })
        );
    },
    googleLogout() {
      this.isActive = !this.isActive;
      this.$auth.logout("google");
    },
  },
};
</script>


<style lang="scss" scoped>
.navbar-brand {
  .brand-title {
    font-size: 35px;
    font-weight: bold;
    display: none;
  }
  // padding-right: 30px;
}
.navbar-item {
  flex-shrink: unset;
}
.avatar {
  margin-right: 5px;
}
</style>
