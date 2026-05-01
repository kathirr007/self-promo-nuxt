import { defineNuxtPlugin } from '#app'

type Validator = (value: unknown) => boolean | string

const required: Validator = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'This field is required.'
  }
  return true
}

const email: Validator = (value) => {
  if (value === null || value === undefined || value === '')
    return true
  const pattern = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  return pattern.test(String(value)) || 'Please enter a valid email address.'
}

function minLength(min: number): Validator {
  return (value) => {
    if (value === null || value === undefined)
      return true
    return String(value).length >= min || `Minimum length is ${min} characters.`
  }
}

function maxLength(max: number): Validator {
  return (value) => {
    if (value === null || value === undefined)
      return true
    return String(value).length <= max || `Maximum length is ${max} characters.`
  }
}

function sameAs(compare: unknown): Validator {
  return (value) => {
    return value === compare || 'Values do not match.'
  }
}

function validate(value: unknown, validators: Validator[]) {
  return validators.map(validator => validator(value))
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuelidate = {
    required,
    email,
    minLength,
    maxLength,
    sameAs,
    validate,
  }

  nuxtApp.provide('vuelidate', vuelidate)
  nuxtApp.vueApp.config.globalProperties.$vuelidate = vuelidate
})
