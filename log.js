firebase.auth().onAuthStateChanged(user => {
    if(user){
        window.location.href = 'userLogado.html';
    }
})