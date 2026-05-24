function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function looksLikeEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isEmailPrefixName(displayName, email) {
    if (!displayName || !email) return false;
    const prefix = email.split('@')[0]?.trim();
    return displayName.trim() === prefix;
}

function getTicketTimestamp(ticket) {
    if (!ticket.criadoEm) return 0;
    if (typeof ticket.criadoEm.toDate === 'function') {
        return ticket.criadoEm.toDate().getTime();
    }
    if (ticket.criadoEm.seconds) {
        return ticket.criadoEm.seconds * 1000;
    }
    return 0;
}

async function getStoredName(uid) {
    if (!uid) return '';

    const storedName = localStorage.getItem(`userName:${uid}`)?.trim();
    if (storedName && !looksLikeEmail(storedName)) {
        return storedName;
    }

    return '';
}

async function getFirestoreName(uid) {
    try {
        const userDoc = await db.collection("users").doc(uid).get();
        const savedName = userDoc.exists ? userDoc.data().name : "";
        if (typeof savedName === 'string' && savedName.trim() && !looksLikeEmail(savedName)) {
            return savedName.trim();
        }
    } catch (error) {
        console.warn("Não foi possível carregar o nome do usuário no Firestore:", error);
    }

    return '';
}

async function getUserName(user) {
    try {
        await user.reload();
    } catch (error) {
        console.warn("Não foi possível recarregar o usuário atual:", error);
    }

    const freshUser = firebase.auth().currentUser || user;
    const firestoreName = await getFirestoreName(freshUser.uid);
    if (firestoreName) {
        localStorage.setItem(`userName:${freshUser.uid}`, firestoreName);
        return firestoreName;
    }

    const storedName = await getStoredName(freshUser.uid);
    if (storedName) {
        return storedName;
    }

    const displayName = freshUser.displayName?.trim();
    if (displayName && !looksLikeEmail(displayName) && !isEmailPrefixName(displayName, freshUser.email)) {
        return displayName;
    }

    return freshUser.email?.split('@')[0] || 'Usuário';
}

firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
        window.location.href = "CadUser.html";
        return;
    }

    const userName = await getUserName(user);
    const userEmail = user.email || 'Email não disponível';

    document.getElementById("user-name").textContent = userName;
    document.getElementById("user-email").textContent = userEmail;

    const avatar = document.getElementById("perfilAvatar");
    if (avatar) {
        avatar.textContent = getInitials(userName);
    }

    const ticketsList = document.getElementById("user-tickets");

    try {
        const snapshot = await db.collection("ingressos")
            .where("userId", "==", user.uid)
            .get();

        const tickets = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        tickets.sort((a, b) => getTicketTimestamp(b) - getTicketTimestamp(a));

        if (tickets.length) {
            ticketsList.innerHTML = "";
            tickets.forEach(data => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <strong>Evento:</strong> ${data.evento || 'Evento não informado'} <br>
                    <strong>Data:</strong> ${data.data || 'Data não informada'} <br>
                    <strong>Horário:</strong> ${data.horario || 'Horário não informado'} <br>
                    <strong>Total:</strong> ${data.total || 'Total não informado'} <br>
                    <strong>Status:</strong> ${data.status || 'Aprovado'} <br>
                    <strong>Pagamento:</strong> ${data.pagamento || 'pix'}
                `;
                ticketsList.appendChild(listItem);
            });
        } else {
            ticketsList.innerHTML = "<li>Você ainda não possui ingressos cadastrados.</li>";
        }
    } catch (error) {
        console.error("Erro ao buscar ingressos:", error);
        document.getElementById("status-message").textContent = "Erro ao carregar ingressos.";
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
