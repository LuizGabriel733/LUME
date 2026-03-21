firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.getElementById("user-name").textContent = user.displayName || "Usuário sem nome";
        document.getElementById("user-email").textContent = user.email || "Email não disponível";

        const improvementsList = document.getElementById("user-improvements");
        db.collection("melhorias")
            .where("userId", "==", user.uid)
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `
                            <strong>Título:</strong> ${data.titulo} <br>
                            <strong>Descrição:</strong> ${data.melhoria} <br>
                            <strong>Endereço:</strong> ${data.endereco}, ${data.bairro} <br>
                            ${data.fileUrl ? `<img src="${data.fileUrl}" alt="Imagem da melhoria" style="max-width: 200px; max-height: 200px;">` : ''}
                        `;
                        improvementsList.appendChild(listItem);
                    });
                } else {
                    improvementsList.innerHTML = "<li>Você ainda não cadastrou nenhuma melhoria.</li>";
                }
            })
            .catch(error => {
                console.error("Erro ao buscar melhorias:", error);
                document.getElementById("status-message").textContent = "Erro ao carregar melhorias.";
            });

       
        const denunciasList = document.getElementById("denuncia");
        db.collection("denuncia")
            .where("userId", "==", user.uid)
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `
                            <strong>Título:</strong> ${data.titulo} <br>
                            <strong>Descrição:</strong> ${data.denuncia} <br>
                            <strong>Tipo:</strong> ${data.tipoProblema} <br>
                            <strong>Endereço:</strong> ${data.endereco}, ${data.bairro} <br>
                            ${data.fileUrl ? `<img src="${data.fileUrl}" alt="Imagem da denúncia" style="max-width: 200px; max-height: 200px;">` : ''}
                        `;
                        denunciasList.appendChild(listItem);
                    });
                } else {
                    denunciasList.innerHTML = "<li>Você ainda não cadastrou nenhuma denúncia.</li>";
                }
            })
            .catch(error => {
                console.error("Erro ao buscar denúncias:", error);
                document.getElementById("status-message").textContent = "Erro ao carregar denúncias.";
            });
    } else {
        window.location.href = "CadUser.html";
    }
});


const voltar = document.getElementById('voltar');
voltar.addEventListener('click', () => {
    window.location.href = "userLogado.html";
});


const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', () => {
    firebase.auth().signOut()
        .then(() => {
            alert('Você saiu da conta.');
            window.location.href = "CadUser.html";
        })
        .catch(error => {
            console.error("Erro ao fazer logout:", error);
        });
});
