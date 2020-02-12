export default function({store, redirect}) {
    const isAdmin = store.getters['authentication/isAdmin']

    if(!isAdmin) {
        // return redirect('/')
        return redirect('/notAuthorized')
    }
}