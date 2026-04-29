import { helpers } from 'vuelidate/lib/validators'

export const supportedFileTypes = (value) => {

    if(!helpers.req(value)) return true
    const allowedFormats = ['jpg', 'png', 'jpeg', 'svg']

    const extension = value.split('.').pop()
    return allowedFormats.includes(extension)

    // if(allowedFormats.includes(extension)) {
    //     return true
    // } else {
    //     return false
    // }
}