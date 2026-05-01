<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useHead({ title: 'Register | Kathiravan K' })

const authStore = useAuthenticationStore()
const router = useRouter()

const production = import.meta.client ? window.location.hostname !== 'localhost' : false

const form = reactive({
  username: '',
  name: '',
  avatar: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const errors = reactive({ username: '', name: '', email: '', avatar: '', password: '', passwordConfirmation: '' })
const touched = reactive({ username: false, name: false, email: false, avatar: false, password: false, passwordConfirmation: false })
const isRegistering = ref(false)

function validate() {
  return {
    username: !form.username ? 'Username is required' : form.username.length < 6 ? 'Username minimum length is 6 characters' : '',
    name: !form.name ? 'Name is required' : form.name.length < 6 ? 'Name minimum length is 6 characters' : '',
    email: !form.email ? 'Email is required' : !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(form.email) ? 'Email address is not valid' : '',
    avatar: form.avatar && !/^https?:\/\/.+/.test(form.avatar) ? 'Url format is not valid!' : '',
    password: !form.password ? 'Password is required' : form.password.length < 6 ? 'Password minimum length is 6 letters' : '',
    passwordConfirmation: !form.passwordConfirmation ? 'Confirm Password is required' : form.passwordConfirmation !== form.password ? 'Confirm Password should be the same as password' : '',
  }
}

const isFormValid = computed(() => Object.values(validate()).every(e => !e))

function touchField(field: keyof typeof touched) {
  touched[field] = true
  const v = validate()
  errors[field] = v[field]
}

async function register() {
  Object.keys(touched).forEach(k => (touched[k as keyof typeof touched] = true))
  const v = validate()
  Object.assign(errors, v)
  if (!isFormValid.value)
    return

  isRegistering.value = true
  try {
    await authStore.register(form)
    await router.push('/login')
  }
  catch (error: any) {
    errors.email = error?.message ?? 'Registration failed'
  }
  finally {
    isRegistering.value = false
  }
}
</script>

<template>
  <section class="hero is-success">
    <div v-if="!production" class="hero-body p-4">
      <div class="container has-text-centered">
        <div class="column is-6 is-offset-3 px-0">
          <h3 class="title has-text-grey">
            Register
          </h3>
          <p class="subtitle has-text-grey">
            Please register to proceed.
          </p>
          <div class="box">
            <figure class="avatar">
              <img alt="User Avatar" :src="form.avatar || 'https://via.placeholder.com/300'">
            </figure>
            <form class="mt-3">
              <div v-for="field in (['username', 'name', 'email', 'avatar'] as const)" :key="field" class="field">
                <div class="control">
                  <input
                    v-model="form[field]"
                    class="input"
                    :type="field === 'email' ? 'email' : 'text'"
                    :placeholder="field.charAt(0).toUpperCase() + field.slice(1)"
                    @blur="touchField(field)"
                    @keyup.enter="touchField(field)"
                  >
                  <div v-if="touched[field] && errors[field]" class="form-error">
                    <span class="help is-danger">{{ errors[field] }}</span>
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
                    autocomplete="new-password"
                    @blur="touchField('password')"
                    @keyup.enter="touchField('password')"
                  >
                  <div v-if="touched.password && errors.password" class="form-error">
                    <span class="help is-danger">{{ errors.password }}</span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    v-model="form.passwordConfirmation"
                    class="input"
                    type="password"
                    placeholder="Password Confirmation"
                    autocomplete="off"
                    @blur="touchField('passwordConfirmation')"
                    @keyup.enter="touchField('passwordConfirmation')"
                  >
                  <div v-if="touched.passwordConfirmation && errors.passwordConfirmation" class="form-error">
                    <span class="help is-danger">{{ errors.passwordConfirmation }}</span>
                  </div>
                </div>
              </div>
              <button
                :disabled="!isFormValid || isRegistering"
                type="submit"
                class="button is-block is-info is-fullwidth"
                :class="{ 'is-loading': isRegistering }"
                @click.prevent="register"
              >
                {{ isRegistering ? 'Registering...' : 'Register' }}
              </button>
            </form>
          </div>
          <p class="has-text-grey has-text-centered">
            <span class="is-block">Already you have account?</span>
            <NuxtLink to="/login" class="mr-2">
              Login
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
    <div v-else class="hero-body">
      <p class="has-text-centered has-text-black">
        Hello, You are not allowed to register. Registration is only for Development purpose.
      </p>
      <p class="has-text-centered has-text-black">
        Please contact
        <a href="mailto:kathirr007@gmail.com" class="is-underlined has-text-primary">Administrator</a>
      </p>
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
  margin-top: -4.25rem;
  padding-top: 1rem;
  margin-bottom: 4.5rem;
}
</style>
