
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
     var typed = new Typed(".typing-2", {
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
    if(inputPass.type === 'password'){
        inputPass.setAttribute('type','text')
        btnShowpass.classList.replace('bi-eye','bi-eye-slash')
    }else{
        inputPass.setAttribute('type','password')
        btnShowpass.classList.replace('bi-eye-slash','bi-eye')
    }

}

function mostrarsi(){
    var inputPasssi = document.getElementById('sipassword')
    var btnShowpasssi = document.getElementById('toquesi')
    if(inputPasssi.type === 'password'){
        inputPasssi.setAttribute('type','text')
        btnShowpasssi.classList.replace('bi-eye','bi-eye-slash')
    }else{
        inputPasssi.setAttribute('type','password')
        btnShowpasssi.classList.replace('bi-eye-slash','bi-eye')
    }

}
// script.js

function abrirCard(card) {
    alert("Você clicou em: " + card.querySelector("h3").innerText);
}

// Referência para o formulário
const reportForm = document.getElementById('reportForm');

// Adiciona evento de envio ao formulário
reportForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Simulação de envio de formulário
    alert("Denúncia enviada com sucesso!");
    
    // Limpa o formulário após o envio
    reportForm.reset();
});

