export default ({store, redirect}) {
    const isAadmin = store.getters['auth/isAadmin']

    if(!isAadmin) {
        // navigate later to notAuthorized page
        return redirect('/')
    }
}