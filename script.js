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
const modalOverlay = document.getElementById("modal-overlay"); // Modal do Card
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

// ==================== 3. SISTEMA DE BUSCA ====================
function iniciarBusca() {
    if (todosOsDados.length === 0) return;

    const termo = inputBusca.value.toLowerCase();

    // Busca no nome ou nas tags ocultas
    const filtrados = todosOsDados.filter(dado => {
        const nome = dado.nome.toLowerCase();
        const tags = dado.tags ? dado.tags.join(" ").toLowerCase() : "";
        return nome.includes(termo) || tags.includes(termo);
    });

    renderizarCards(filtrados);
}

// ==================== 4. CONTROLE DOS MODAIS ====================

// Fecha todos os modais de uma vez para evitar sobreposição
function fecharTodosModais() {
    modalOverlay.style.display = "none";
    modalSobre.style.display = "none";
    modalContato.style.display = "none";
    modalTCC.style.display = "none";
}

// Abre o modal de detalhes do card
function abrirModal(nome, categoria, explicacaoLiteral) {
    modalTitulo.innerText = nome;
    modalCategoria.innerText = categoria;
    modalTexto.innerText = explicacaoLiteral;
    modalOverlay.style.display = "flex";
}

// Abre os modais de menu
function abrirModalSobre() { modalSobre.style.display = "flex"; }
function abrirModalContato() { modalContato.style.display = "flex"; }
function abrirModalTCC() { modalTCC.style.display = "flex"; }

// Funções de fechar
function fecharModal() { fecharTodosModais(); }
function fecharModalSobre() { fecharTodosModais(); }
function fecharModalContato() { fecharTodosModais(); }
function fecharModalTCC() { fecharTodosModais(); }

// Fecha ao clicar fora da janela (no fundo escuro)
window.onclick = function (event) {
    if (event.target == modalOverlay || event.target == modalSobre || event.target == modalContato || event.target == modalTCC) {
        fecharTodosModais();
    }
}

// ==================== 5. RENDERIZAÇÃO (DESENHO NA TELA) ====================
function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa a tela antes de desenhar

    if (dados.length === 0) {
        cardContainer.innerHTML = `<p style="text-align:center; width:100%; color: #5d4037;">Nada encontrado na toca... 🦊 Tente outra palavra.</p>`;
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");

        // Cria link de pesquisa seguro para o Youtube (Evita links quebrados)
        let linkSeguro = `https://www.youtube.com/results?search_query=${encodeURIComponent("Como lidar com " + dado.nome + " TCC")}`;

        // Trata aspas simples no texto para não quebrar o HTML do botão onclick
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
botaoBusca.addEventListener("click", iniciarBusca);