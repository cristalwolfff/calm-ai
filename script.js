/* PROJETO CALM.AÍ 
    Desenvolvido para Imersão Dev Alura + Google 2025
    Autora: Cristalwolf
    Descrição: Lógica principal para busca, renderização de cards e controle de modais.
*/

// ==================== 1. SELEÇÃO DE ELEMENTOS ====================
const cardContainer = document.querySelector(".card-container");
const inputBusca = document.querySelector(".search-bar input");
const botaoBusca = document.querySelector("#botao-busca");
let todosOsDados = [];

// Modais
const modalOverlay = document.getElementById("modal-overlay");
const modalTitulo = document.getElementById("modal-titulo");
const modalTexto = document.getElementById("modal-texto");
const modalCategoria = document.getElementById("modal-categoria");

const modalSobre = document.getElementById("modal-sobre");
const modalContato = document.getElementById("modal-contato");
const modalTCC = document.getElementById("modal-tcc");

// ==================== 2. CARREGAMENTO DE DADOS ====================
async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        todosOsDados = await resposta.json();
        renderizarCards(todosOsDados);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        cardContainer.innerHTML = `<p style="text-align:center; width:100%;">A toca parece vazia... Tente recarregar a página. 🦊</p>`;
    }
}

// ==================== 3. SISTEMA DE BUSCA (LOCAL + GOOGLE) ====================

// A. Busca Automática (Local) - Roda enquanto digita
function iniciarBusca() {
    if (todosOsDados.length === 0) return;

    const termo = inputBusca.value.toLowerCase();

    const filtrados = todosOsDados.filter(dado => {
        const nome = dado.nome.toLowerCase();
        const tags = dado.tags ? dado.tags.join(" ").toLowerCase() : "";
        return nome.includes(termo) || tags.includes(termo);
    });

    renderizarCards(filtrados);
}

// B. Busca Avançada (Google) - Roda ao clicar no botão
function buscarNoGoogle() {
    const termo = inputBusca.value.trim();
    
    // Se não tiver nada escrito, não faz nada (ou pode dar um alerta fofo)
    if (termo === "") {
        alert("Digite o que você está sentindo primeiro! 🦊");
        return;
    }

    // Monta a pesquisa específica para TCC
    const queryGoogle = `Como lidar com ${termo} usando Terapia Cognitivo Comportamental`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(queryGoogle)}`;

    // Abre em nova aba
    window.open(url, '_blank');
}

// ==================== 4. CONTROLE DOS MODAIS ====================
function fecharTodosModais() {
    modalOverlay.style.display = "none";
    modalSobre.style.display = "none";
    modalContato.style.display = "none";
    modalTCC.style.display = "none";
}

function abrirModal(nome, categoria, explicacaoLiteral) {
    modalTitulo.innerText = nome;
    modalCategoria.innerText = categoria;
    modalTexto.innerText = explicacaoLiteral;
    modalOverlay.style.display = "flex";
}

function abrirModalSobre() { modalSobre.style.display = "flex"; }
function abrirModalContato() { modalContato.style.display = "flex"; }
function abrirModalTCC() { modalTCC.style.display = "flex"; }

function fecharModal() { fecharTodosModais(); }
function fecharModalSobre() { fecharTodosModais(); }
function fecharModalContato() { fecharTodosModais(); }
function fecharModalTCC() { fecharTodosModais(); }

window.onclick = function (event) {
    if (event.target == modalOverlay || event.target == modalSobre || event.target == modalContato || event.target == modalTCC) {
        fecharTodosModais();
    }
}

// ==================== 5. RENDERIZAÇÃO (DESENHO NA TELA) ====================
function renderizarCards(dados) {
    cardContainer.innerHTML = ""; 

    if (dados.length === 0) {
        // MUDANÇA AQUI: Mensagem instruindo a usar o botão
        cardContainer.innerHTML = `
            <div style="text-align:center; width:100%; color: #5d4037; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <p style="font-size: 1.2rem;">Nada encontrado na toca sobre isso... 🦊</p>
                <p style="font-size: 1rem;">Tente outra palavra ou clique no botão <strong>"Me ajude 🐾"</strong> para buscar uma técnica no Google.</p>
            </div>
        `;
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        let linkSeguro = `https://www.youtube.com/results?search_query=${encodeURIComponent("Como lidar com " + dado.nome + " TCC")}`;
        let textoSeguro = dado.explicacao_literal.replace(/'/g, "\\'");

        article.innerHTML = `
            <div>
                <p>${dado.data_criacao}</p> 
                <h2>${dado.nome}</h2>        
                <p>${dado.descricao}</p>
                
                <button class="botao-saber-mais" 
                    onclick="abrirModal('${dado.nome}', '${dado.data_criacao}', '${textoSeguro}')">
                    Saber mais ℹ️
                </button>
            </div>
            
            <a href="${linkSeguro}" target="_blank" class="link-youtube" title="Pesquisar técnicas no YouTube">
                Como aliviar ›
            </a>
        `;
        cardContainer.appendChild(article);
    }
}

// Inicialização
carregarDados();

// Eventos
inputBusca.addEventListener("input", iniciarBusca);

// MUDANÇA AQUI: O botão agora chama a busca do Google, não a busca local
botaoBusca.addEventListener("click", buscarNoGoogle);