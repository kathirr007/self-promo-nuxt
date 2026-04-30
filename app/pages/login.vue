<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useHead({ title: 'Login | Kathiravan K' })

const authStore = useAuthenticationStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const touched = reactive({ email: false, password: false })
const isLoggedIn = computed(() => authStore.isAuthenticated)
const isLoggingIn = ref(false)

function validateEmail() {
  if (!form.email)
    return 'Email is required'
  if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(form.email))
    return 'Email address is not valid'
  return ''
}

function validatePassword() {
  if (!form.password)
    return 'Password is required'
  if (form.password.length < 6)
    return 'Password should be minimum 6 characters'
  return ''
}

const isFormValid = computed(() => !validateEmail() && !validatePassword())

function touchField(field: 'email' | 'password') {
  touched[field] = true
  if (field === 'email')
    errors.email = validateEmail()
  if (field === 'password')
    errors.password = validatePassword()
}

async function login() {
  touched.email = true
  touched.password = true
  errors.email = validateEmail()
  errors.password = validatePassword()
  if (!isFormValid.value)
    return

  isLoggingIn.value = true
  try {
    await authStore.login(form)
    await router.push('/')
  }
  catch {
    errors.email = 'Wrong email or password'
  }
  finally {
    isLoggingIn.value = false
  }
}
</script>

<template>
  <section class="hero is-success">
    <div class="hero-body p-4">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4 px-0">
          <h3 class="title has-text-grey">
            Login
          </h3>
          <p class="subtitle has-text-grey">
            Please login to proceed.
          </p>
          <div class="box">
            <form>
              <div class="field">
                <div class="control">
                  <input
                    v-model="form.email"
                    class="input"
                    type="email"
                    placeholder="Your Email"
                    autofocus
                    autocomplete="email"
                    @blur="touchField('email')"
                    @keyup.enter="touchField('email')"
                  >
                  <div v-if="touched.email && errors.email" class="form-error">
                    <span class="help is-danger">{{ errors.email }}</span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    v-model="form.password"
                    class="input"
                    type="password"
                    placeholder="Your Password"
                    autocomplete="current-password"
                    @blur="touchField('password')"
                    @keyup.enter="touchField('password')"
                  >
                  <div v-if="touched.password && errors.password" class="form-error">
                    <span class="help is-danger">{{ errors.password }}</span>
                  </div>
                </div>
              </div>
              <button
                :disabled="!isFormValid || isLoggingIn"
                class="button is-block is-info is-fullwidth"
                :class="{ 'is-loading': isLoggingIn }"
                @click.prevent="login"
                @keyup.enter="login"
              >
                {{ isLoggingIn ? 'Logging in...' : 'Login' }}
              </button>
            </form>
          </div>
          <div class="has-text-grey">
            <div v-if="isLoggedIn">
              <span>{{ authStore.authUser?.email }}</span>
            </div>
            <div v-else>
              <p class="has-text-gray has-text-centered">
                Don't have account?
                <NuxtLink to="/register">
                  Sign Up
                </NuxtLink>
              </p>
              <p class="has-text-gray has-text-centered">
                Forget Password?
                <NuxtLink to="/resetpassword">
                  Reset Password
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero.is-success {
  background: #f2f6fa;
}
.hero .nav,
.hero.is-success .nav {
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
  box-shadow:
    0 2px 3px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
}
p.subtitle {
  padding-top: 1rem;
}
</style>
