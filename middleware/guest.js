export default function({store, redirect}) {
    const isAuth = store.getters['auth/isAuthenticated']

    if(isAuth) {
        // navigate later to notAuthorized page
        return redirect('/')
    }
}