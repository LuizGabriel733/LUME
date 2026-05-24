const USER_LOGADO_PAGE = 'userLogado.html';

firebase.auth().onAuthStateChanged(user => {
    if (user && !window.location.pathname.endsWith('/' + USER_LOGADO_PAGE)) {
        window.location.replace(USER_LOGADO_PAGE);
    }
});