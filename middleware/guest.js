export default function({store, redirect}) {
    const isAuth = store.getters['authentication/isAuthenticated']

    if(isAuth) {
        // navigate later to notAuthorized page
        return redirect('/')
    }
}