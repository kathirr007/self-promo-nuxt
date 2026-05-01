<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useHead({ title: 'Reset Password | Kathiravan K' })

const authStore = useAuthenticationStore()
const router = useRouter()

const form = reactive({ email: '', oldPassword: '', newPassword: '', passwordConfirmation: '' })
const errors = reactive({ email: '', oldPassword: '', newPassword: '', passwordConfirmation: '' })
const touched = reactive({ email: false, oldPassword: false, newPassword: false, passwordConfirmation: false })
const isResetting = ref(false)

function validate() {
  return {
    email: !form.email ? 'Email is required' : !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(form.email) ? 'Email address is not valid' : '',
    oldPassword: !form.oldPassword ? 'Password is required' : form.oldPassword.length < 6 ? 'Password should be minimum 6 characters' : '',
    newPassword: !form.newPassword ? 'New Password is required' : form.newPassword.length < 6 ? 'New Password should be minimum 6 characters' : '',
    passwordConfirmation: !form.passwordConfirmation ? 'Confirm Password is required' : form.passwordConfirmation !== form.newPassword ? 'Confirm Password should match with New Password' : '',
  }
}

const isFormValid = computed(() => Object.values(validate()).every(e => !e))

function touchField(field: keyof typeof touched) {
  touched[field] = true
  errors[field] = validate()[field]
}

async function resetPassword() {
  Object.keys(touched).forEach(k => (touched[k as keyof typeof touched] = true))
  Object.assign(errors, validate())
  if (!isFormValid.value)
    return

  isResetting.value = true
  try {
    const res = await authStore.resetPassword(form) as any
    if (res?.status !== 'OK') {
      errors.email = res?.message ?? 'Reset failed'
    }
    else {
      await router.push('/login')
    }
  }
  catch {
    errors.email = 'Wrong email or password doesn\'t match'
  }
  finally {
    isResetting.value = false
  }
}
</script>

<template>
  <section class="hero is-success">
    <div class="hero-body p-4">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4 px-0">
          <h3 class="title has-text-grey">
            Reset Password
          </h3>
          <p class="subtitle has-text-grey">
            Please proceed to reset Password.
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
                    v-model="form.oldPassword"
                    class="input"
                    type="password"
                    placeholder="Current Password"
                    autocomplete="current-password"
                    @blur="touchField('oldPassword')"
                    @keyup.enter="touchField('oldPassword')"
                  >
                  <div v-if="touched.oldPassword && errors.oldPassword" class="form-error">
                    <span class="help is-danger">{{ errors.oldPassword }}</span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    v-model="form.newPassword"
                    class="input"
                    type="password"
                    placeholder="New Password"
                    autocomplete="new-password"
                    @blur="touchField('newPassword')"
                    @keyup.enter="touchField('newPassword')"
                  >
                  <div v-if="touched.newPassword && errors.newPassword" class="form-error">
                    <span class="help is-danger">{{ errors.newPassword }}</span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    v-model="form.passwordConfirmation"
                    class="input"
                    type="password"
                    placeholder="Confirm New Password"
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
                :disabled="!isFormValid || isResetting"
                class="button is-block is-info is-fullwidth"
                :class="{ 'is-loading': isResetting }"
                @click.prevent="resetPassword"
                @keyup.enter="resetPassword"
              >
                {{ isResetting ? 'Resetting...' : 'Reset Password' }}
              </button>
            </form>
          </div>
          <div class="has-text-grey">
            <p class="has-text-gray has-text-centered">
              Don't have account?
              <NuxtLink to="/register">
                Sign Up
              </NuxtLink>
            </p>
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
p.subtitle {
  padding-top: 1rem;
}
</style>
