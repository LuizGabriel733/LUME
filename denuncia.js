async function enviarDenunciar() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const endereco = document.getElementById('endereco').value;
    const bairro = document.getElementById('bairro').value;
    const titulo = document.getElementById('titulo').value;
    const denuncia = document.getElementById('denuncia').value;
    const tipoProblema = document.getElementById('tipoProblema').value; 
    const fileInput = document.getElementById('fileUpload');

    let fileUrl = ""; 

    try {
    
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];

            if (file.size > 10 * 1024 * 1024) {
                alert("O arquivo é muito grande. O limite permitido é de 10 MB.");
                return;
            }

            const timestamp = Date.now();
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const uniqueFileName = `${timestamp}_${sanitizedFileName}`;

            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`uploads/${uniqueFileName}`);

            const metadata = {
                contentType: file.type,
            };

            await fileRef.put(file, metadata);
            fileUrl = await fileRef.getDownloadURL(); 
        }

        await db.collection("denuncia").add({
            userId: firebase.auth().currentUser.uid,
            nome,
            email,
            endereco,
            bairro,
            titulo,
            denuncia,
            tipoProblema,
            fileUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        alert("Informações enviadas com sucesso!");
        document.getElementById('reportForm').reset();
        document.getElementById('file-name').textContent = "Nenhum arquivo selecionado";
    } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        alert("Erro ao enviar os dados. Por favor, tente novamente.");
    }
    window.location.href = "userLogado.html";
}
