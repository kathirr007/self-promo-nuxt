/* eslint-disable */
import Vue from 'vue'

Vue.filter('shortenText', function(text, maxLength = 300) {
    // debugger
    if(text && typeof(text) === 'string') {
        const finalChar = text.length > maxLength ? '...' : ''
        return text.substr(0, maxLength) + finalChar
    }

    return ''
})