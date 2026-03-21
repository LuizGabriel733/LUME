firebase.auth().onAuthStateChanged(user => {
    if(user){
        window.location.href = 'userLogado.html';
    }
})
function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("sipassword").value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(response => {
            window.location.href = 'userLogado.html';
            console.log('Sucesso');
        })
        .catch(error => {
            if (error.code === 'auth/invalid-credential') {
                alert('Crendecias incorretas.');
            }else if (error.code === 'auth/invalid-email') {
                alert('Formato de email inválido.');
            } 
            console.error(error);
        });
}
function resetPassword(){
    const email = document.getElementById("login-email").value;
    firebase.auth().sendPasswordResetEmail(email)
    .then(response => {
        alert("Email de redefinição de senha enviado com sucesso");
    }).catch(error =>{
        alert("error");
    });
}