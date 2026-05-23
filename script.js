$(document).ready(function(){
    $(window).scroll(function(){
        // Conserta o bug do menu transparente
        if(window.scrollY > 20){
            $('.navbar').addClass("sticky");
        } else {
            $('.navbar').removeClass("sticky");
        }

        // Controla o botão de subir a página
        if(window.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.scroll-up-btn').removeClass("show");
        }
    });

     var typed = new Typed(".typing", {
         strings:["Arte!", "Cultura!", "Conhecimento!"],
         typeSpeed:100,
         backSpeed:60,
         loop:true
     });
     var typed2 = new Typed(".typing-2", { // Mudei para typed2 para não dar conflito com a de cima
        strings:["Arte!", "Cultura!", "Conhecimento!"],
        typeSpeed:100,
        backSpeed:60,
        loop:true
    });

    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    // === NOVO CÓDIGO: Faz os botões do menu funcionarem perfeitamente ===
    $('.navbar .menu li a').click(function(e){
        e.preventDefault(); // Impede o "pulo" seco padrão do HTML
        
        // Pega o nome do link que foi clicado (ex: #home, #title, #contact)
        var sessaoAlvo = $(this).attr("href");
        
        // Rola a página suavemente até a sessão correta
        $('html, body').animate({
            scrollTop: $(sessaoAlvo).offset().top
        }, 500); // 500 é a velocidade (meio segundo)

        // Se estiver usando no celular, fecha o menu automaticamente após clicar
        $('.navbar .menu').removeClass("active");
        $('.menu-btn i').removeClass("active");
    });

    $('.carousel').owlCarousel({
        margin:20,
        loop:true,
        autoplayTimeOut:2000,
        autoplayHoverPauser:true,
        responsive:{
            0:{
                items:1,
                nav:false
            },
            600:{
                items:2,
                nav:false
            },
            1000:{
                items:3,
                nav:false
            }
        }
    });
});

// Função mostrar/esconder senha
function mostrar(){
    var inputPass = document.getElementById('sppassword')
    var btnShowpass = document.getElementById('toque')
    if(inputPass && btnShowpass) { // Proteção para não dar erro se não estiver na página de login
        if(inputPass.type === 'password'){
            inputPass.setAttribute('type','text')
            btnShowpass.classList.replace('bi-eye','bi-eye-slash')
        }else{
            inputPass.setAttribute('type','password')
            btnShowpass.classList.replace('bi-eye-slash','bi-eye')
        }
    }
}

function mostrarsi(){
    var inputPasssi = document.getElementById('sipassword')
    var btnShowpasssi = document.getElementById('toquesi')
    if(inputPasssi && btnShowpasssi) { // Proteção para não dar erro
        if(inputPasssi.type === 'password'){
            inputPasssi.setAttribute('type','text')
            btnShowpasssi.classList.replace('bi-eye','bi-eye-slash')
        }else{
            inputPasssi.setAttribute('type','password')
            btnShowpasssi.classList.replace('bi-eye-slash','bi-eye')
        }
    }
}

function abrirCard(card) {
    alert("Você clicou em: " + card.querySelector("h3").innerText);
}

// Referência para o formulário
const reportForm = document.getElementById('reportForm');

// SÓ adiciona o evento se o formulário existir na página atual
if (reportForm) {
    reportForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Simulação de envio de formulário
        alert("Denúncia enviada com sucesso!");
        
        // Limpa o formulário após o envio
        reportForm.reset();
    });
}

/* =========================================
   LÓGICA DA MODAL DE COMPRA
   ========================================= */

// Horários de funcionamento
const AVAILABLE_TIMES = ["09:00", "10:30", "14:00", "15:30", "17:00"];

// Objeto contendo os preços, quantidades e as IDs do HTML
const tickets = {
    turista:   { price: 20.00, qty: 0, id: 'qtyTurista' },
    residente: { price: 10.00, qty: 0, id: 'qtyResidente' },
    estudante: { price: 10.00, qty: 0, id: 'qtyEstudante' },
    idoso:     { price: 0.00,  qty: 0, id: 'qtyIdoso' },
    crianca:   { price: 0.00,  qty: 0, id: 'qtyCrianca' },
    pcd:       { price: 0.00,  qty: 0, id: 'qtyPcd' }
};

// Selecionando os elementos do HTML
const modal = document.getElementById('purchaseModal');
const closeBtn = document.getElementById('closeModal');
const dateInput = document.getElementById('purchaseDate');
const timeSlotsContainer = document.getElementById('timeSlots');
const totalPriceEl = document.getElementById('totalPrice');

// 1. Evita selecionar dias no passado no calendário
if(dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

// 2. Fechar a modal (O código de abrir mudou de lugar, está mais abaixo)
if(closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target == modal) modal.style.display = 'none';
});

// 3. Gerar os botões de horários ao escolher a data
if(dateInput) {
    dateInput.addEventListener('change', () => {
        timeSlotsContainer.innerHTML = ''; 
        
        AVAILABLE_TIMES.forEach(time => {
            const slot = document.createElement('div');
            slot.classList.add('time-slot');
            slot.innerText = time;
            
            slot.addEventListener('click', () => {
                const currentSelected = document.querySelector('.time-slot.selected');
                if(currentSelected) currentSelected.classList.remove('selected');
                slot.classList.add('selected');
            });
            timeSlotsContainer.appendChild(slot);
        });
    });
}

// 4. Função universal para alterar a quantidade de ingressos
window.changeQty = function(type, change) {
    tickets[type].qty = Math.max(0, tickets[type].qty + change);
    document.getElementById(tickets[type].id).innerText = tickets[type].qty;
    updateTotal();
}

// 5. Função para somar tudo e exibir na tela
function updateTotal() {
    let total = 0;
    for (let categoria in tickets) {
        total += tickets[categoria].qty * tickets[categoria].price;
    }
    if(totalPriceEl) {
        totalPriceEl.innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

// Zera o total logo que a página carrega
updateTotal();

// 6. NOVA FUNÇÃO PARA ABRIR A MODAL E TROCAR O TÍTULO DOS 3 CARDS
window.abrirModalCompra = function(nomeDoEvento) {
    // 6.1. Muda o nome do evento no topo da janela
    const tituloModal = document.getElementById('modalEventTitle');
    if(tituloModal) {
        tituloModal.innerText = "Evento: " + nomeDoEvento;
    }

    // 6.2. Zera as quantidades de todos os ingressos (memória e tela)
    for(let categoria in tickets) {
        tickets[categoria].qty = 0; 
        document.getElementById(tickets[categoria].id).innerText = "0"; 
    }
    updateTotal(); // Zera o total no HTML

    // 6.3. Limpa a data e os horários escolhidos anteriormente
    if(dateInput) dateInput.value = '';
    if(timeSlotsContainer) timeSlotsContainer.innerHTML = '';

    // 6.4. Finalmente, mostra a janela na tela
    if(modal) modal.style.display = 'flex';
}


/* =========================================
   LÓGICA DA TELA DE PAGAMENTO
   ========================================= */

const paymentModal = document.getElementById('paymentModal');
const closePaymentBtn = document.getElementById('closePaymentModal');
const continueBtn = document.querySelector('#purchaseModal .checkout-btn'); 

function hasSelectedTickets() {
    return Object.values(tickets).some(ticket => ticket.qty > 0);
}

function getSelectedTicketsSnapshot() {
    return Object.entries(tickets)
        .filter(([, ticket]) => ticket.qty > 0)
        .map(([type, ticket]) => ({
            tipo: type,
            quantidade: ticket.qty,
            precoUnitario: ticket.price
        }));
}

function getCurrentTotalAmount() {
    return Object.values(tickets).reduce((total, ticket) => total + (ticket.qty * ticket.price), 0);
}

// 1. Abrir modal de pagamento com VALIDAÇÕES
if (continueBtn) {
    continueBtn.addEventListener('click', () => {
        const totalAtual = document.getElementById('totalPrice').innerText;
        const dataSelecionada = document.getElementById('purchaseDate').value;
        const horarioSelecionado = document.querySelector('.time-slot.selected');

        if (!dataSelecionada) {
            alert("Por favor, selecione a data da visitação.");
            return;
        }

        if (!horarioSelecionado) {
            alert("Por favor, selecione o horário desejado.");
            return;
        }

        if (!hasSelectedTickets()) {
            alert("Por favor, selecione pelo menos um ingresso antes de continuar.");
            return;
        }

        document.getElementById('paymentTotalDisplay').innerText = totalAtual;
        document.getElementById('purchaseModal').style.display = 'none';
        paymentModal.style.display = 'flex';

        document.getElementById('paymentResult').innerText = "";
        document.getElementById('cardNumber').value = "";
        document.getElementById('cardExpiry').value = "";
        document.getElementById('cardCvv').value = "";
        document.getElementById('cardName').value = "";
    });
}

// 2. Fechar modal de pagamento
if (closePaymentBtn) {
    closePaymentBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });
}

// 3. Trocar visualização entre PIX e Cartão
window.togglePaymentView = function() {
    const method = document.querySelector('input[name="payMethod"]:checked').value;
    document.getElementById('pixArea').style.display = method === 'pix' ? 'block' : 'none';
    document.getElementById('cardArea').style.display = method === 'card' ? 'block' : 'none';
}

// 4. MÁSCARAS DE FORMATAÇÃO (Cartão e Validade)
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove letras, deixa só números
        value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // A cada 4 números, bota um espaço
        e.target.value = value;
    });
}

const cardExpiryInput = document.getElementById('cardExpiry');
if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove letras
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4); // Bota a barra MM/AA
        }
        e.target.value = value;
    });
}

// 5. PAGAMENTO + SALVAMENTO NO FIRESTORE
window.processarPagamento = async function() {
    const resultDiv = document.getElementById('paymentResult');
    const btn = document.getElementById('finishPaymentBtn');
    const user = window.ensureAuthenticated ? window.ensureAuthenticated() : firebase.auth().currentUser;

    if (!user) {
        return;
    }

    resultDiv.innerText = "⏳ Processando pagamento...";
    resultDiv.className = "payment-msg";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    const tituloElement = document.getElementById('modalEventTitle');
    const dataElement = document.getElementById('purchaseDate');
    const horarioElement = document.querySelector('.time-slot.selected');
    const totalElement = document.getElementById('paymentTotalDisplay');
    const paymentMethod = document.querySelector('input[name="payMethod"]:checked')?.value || 'pix';

    if (!tituloElement || !dataElement || !horarioElement || !totalElement) {
        resultDiv.innerText = "❌ Não foi possível carregar os dados da compra.";
        resultDiv.style.color = "#d9534f";
        btn.disabled = false;
        btn.style.opacity = "1";
        return;
    }

    const ticketSnapshot = getSelectedTicketsSnapshot();
    const totalAmount = getCurrentTotalAmount();

    try {
        await db.collection('ingressos').add({
            userId: user.uid,
            userEmail: user.email || '',
            evento: tituloElement.innerText.replace("Evento: ", ""),
            data: dataElement.value,
            horario: horarioElement.innerText,
            total: `R$ ${totalAmount.toFixed(2).replace('.', ',')}`,
            totalAmount,
            pagamento: paymentMethod,
            ingressos: ticketSnapshot,
            status: 'Aprovado',
            criadoEm: firebase.firestore.FieldValue.serverTimestamp()
        });

        resultDiv.innerText = "✅ Pagamento Aprovado! Seu ingresso está salvo.";
        resultDiv.style.color = "#28a745";
        btn.innerText = "Concluído ✓";
        btn.style.backgroundColor = "#218838";

        setTimeout(() => {
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal) paymentModal.style.display = 'none';

            btn.innerText = "Confirmar Pagamento";
            btn.style.backgroundColor = "#5cb85c";
            btn.disabled = false;
            btn.style.opacity = "1";
        }, 3000);
    } catch (error) {
        console.error('Erro ao salvar ingresso no Firestore:', error);
        resultDiv.innerText = "❌ Não foi possível salvar sua compra. Tente novamente.";
        resultDiv.style.color = "#d9534f";
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.backgroundColor = "#5cb85c";
    }
}

// Função para o botão "Copiar PIX"
window.copiarPix = function(btnCopia) {
    const campoPix = document.getElementById('pixCopiaCola');
    
    // Seleciona o texto e copia para a área de transferência
    campoPix.select();
    campoPix.setSelectionRange(0, 99999); 
    navigator.clipboard.writeText(campoPix.value);
    
    // Muda para o Marrom Escuro quando clica
    btnCopia.innerText = "Copiado! ✓";
    btnCopia.style.backgroundColor = "#6f4e37"; 
    
    // Volta para o Marrom Claro depois de 2 segundos
    setTimeout(() => {
        btnCopia.innerText = "Copiar Código PIX";
        btnCopia.style.backgroundColor = "#a67c52";
    }, 2000);
}