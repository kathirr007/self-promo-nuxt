export default function({store, redirect}) {
    const isAuth = store.getters['authentication/isAuthenticated'];

    if(!isAuth) {
        // return redirect('/')
        return redirect('/notAuthenticated')
    }
}