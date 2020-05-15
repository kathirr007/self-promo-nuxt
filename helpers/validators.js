import { helpers } from 'vuelidate/lib/validators'

export const supportedFileTypes = (value) => {
    // debugger
    if(!helpers.req(value)) return true
    const allowedFormats = ['jpg', 'png', 'jpeg', 'svg']
    // debugger
    const extension = value.split('.').pop()
    return allowedFormats.includes(extension)

    // if(allowedFormats.includes(extension)) {
    //     return true
    // } else {
    //     return false
    // }
}