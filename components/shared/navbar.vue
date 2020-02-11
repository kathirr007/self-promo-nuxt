<template>
  <nav class="navbar is-active" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <nuxt-link class="navbar-item" to="/">
        <h1 class="brand-title">Vue-Nuxt Promo</h1>
      </nuxt-link>
      <!-- Adds click to open -->
      <!-- Adds active class -->
      <a @click="isActive = !isActive"
        :class="{'is-active': isActive}"
         role="button"
         class="navbar-burger burger"
         aria-label="menu"
         aria-expanded="false"
         data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <!-- Adds active class -->
    <div id="navbarBasicExample"
         class="navbar-menu" :class="{'is-active': isActive}">
      <div class="navbar-start">
        <nav-link to="/" class="navbar-item">
          Home
        </nav-link>
        <nav-link to="/courses" class="navbar-item">
          Courses
        </nav-link>
        <!-- <nav-link to="/instructor/courses" class="navbar-item">
          Courses
        </nav-link> -->
        <nav-link to="/blogs" class="navbar-item">
          Blogs
        </nav-link>
        <nav-link to="/about" class="navbar-item">
          About
        </nav-link>
        <nav-link to="/cv" class="navbar-item">
          Cv
        </nav-link>
        <!-- <nav-link to="/instructor" class="navbar-item">
          Instructor
        </nav-link>
        <nav-link to="/secret" class="navbar-item">
          Secret
        </nav-link> -->
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <!-- If Authenticated -->
            <template v-if="isAuth">
              <figure class="image avatar is-48x48 m-r-sm">
                <img class="is-rounded" :src="user.avatar">
              </figure>
              <div class="m-r-sm m-b-sm">
                Welcome {{user.username}}!
              </div>
              <!-- If Admin -->
              <button
                 v-if="isAdmin" class="button is-link is-outlined"
                 @click="$router.push('/instructor')">
                Instructor
              </button>
              <a class="button is-primary" @click.prevent="logout">
                Logout
              </a>
            </template>
            <template v-else>
              <nav-link to="/register" class="button is-primary">
                Sign up
              </nav-link>
              <nav-link to="/login" class="button is-light">
                Log in
              </nav-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        'user': 'auth/authUser',
        'isAuth': 'auth/isAuthenticated',
        'isAdmin': 'auth/isAdmin',
      })
    },
    data() {
      return {
        isActive: false
      }
    },
    methods: {
      logout() {
        this.$store.dispatch('auth/logout', this.form)
          .then(() => {
            // this.$router.push('/')
            this.$router.push('/login')
            this.$toasted.success('Successfully logged out...', { duration: 3000 })
          })
          .catch(err => this.$toasted.error('There is something wrong.. :(', { duration: 3000 }))
      }
    }
  }
</script>


<style lang="scss" scoped>
  .brand-title {
    font-size: 35px;
    font-weight: bold;
  }
  .navbar-brand {
    // padding-right: 30px;
  }
  .navbar-item {
    flex-shrink: unset;
  }
  .avatar {
    margin-right: 5px;
  }
</style>
