$(document).ready(function(){
    $(window).scroll(function(){
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        };
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });
     $('.scroll-up-btn').click(function(){
         $('html').animate({scrollTop: 0});
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