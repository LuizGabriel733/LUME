function isValidEmail(email) {
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function saveUserName(uid, name) {
    if (!uid || !name) return;
    localStorage.setItem(`userName:${uid}`, name.trim());
}

async function register() {
    const signUpName = document.getElementById("sign-upName").value;
    const signUpEmail = document.getElementById("signup-email").value;
    const signUpPassword = document.getElementById("sppassword").value;

    if (!isValidEmail(signUpEmail)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    if (signUpPassword.length < 8) {
        alert('A senha deve conter pelo menos 8 caracteres.');
        return;
    }

    if (signUpName.trim() === "") {
        alert('Por favor, insira seu nome.');
        return;
    }

    try {
        const response = await firebase.auth().createUserWithEmailAndPassword(signUpEmail, signUpPassword);
        const user = response.user;

        await user.updateProfile({
            displayName: signUpName
        });

        await user.reload();

        const freshUser = firebase.auth().currentUser || user;

        await firebase.firestore().collection("users").doc(freshUser.uid).set({
            name: signUpName,
            email: signUpEmail,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        saveUserName(freshUser.uid, signUpName);

        try {
            await freshUser.sendEmailVerification();
        } catch (emailError) {
            console.error('Erro ao enviar verificação de e-mail:', emailError);
        }

        alert('Conta criada com sucesso! Verifique seu e-mail para confirmar.');
        console.log('Usuário salvo no Firestore com sucesso!');
        window.location.href = 'CadUser.html';
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
            case 'auth/email-already-in-use':
                alert('O e-mail informado já está sendo utilizado em outra conta.');
                break;
            case 'auth/invalid-email':
                alert('O e-mail informado é inválido. Por favor, insira um e-mail válido.');
                break;
            case 'auth/weak-password':
                alert('A senha deve conter pelo menos 6 caracteres.');
                break;
            default:
                alert('Ocorreu um erro: ' + errorMessage);
        }

        console.error(error);
    }
}