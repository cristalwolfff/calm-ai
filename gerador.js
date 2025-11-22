/* * -----------------------------------------------------------------------
 * PROJETO CALM.AÍ - GERADOR DE CONTEÚDO (BACK-END)
 * -----------------------------------------------------------------------
 * Autor: Cristalwolf
 * Contexto: Imersão Dev com Google Gemini 2025
 * Descrição: Script Node.js que conecta à API do Google Gemini para 
 * gerar a base de conhecimento terapêutica (JSON) usada na aplicação.
 * -----------------------------------------------------------------------
 */

import 'dotenv/config';
import * as fs from 'fs/promises';

// --- 1. CONFIGURAÇÕES E CONSTANTES ---
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_ID = 'gemini-2.5-flash-preview-09-2025'; // Versão do modelo
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`;

const ARQUIVO_SAIDA = 'data.json';
const TOTAL_ITENS = 18; // Quantidade de cards a gerar

// --- 2. DEFINIÇÃO DA ESTRUTURA DE DADOS (SCHEMA) ---
// Isso garante que a IA devolva EXATAMENTE o formato que o site precisa
const responseSchema = {
    type: "ARRAY",
    items: {
        type: "OBJECT",
        properties: {
            "nome": { 
                "type": "STRING", 
                "description": "Nome do sintoma ou distorção (ex: Ruminação, Ansiedade Social)." 
            },
            "descricao": { 
                "type": "STRING", 
                "description": "Resumo curto para o card. Pode usar uma metáfora simples." 
            },
            "explicacao_literal": { 
                "type": "STRING", 
                "description": "Explicação DETALHADA, SIMPLES e HUMANA. Descreva a sensação física e mental real. Evite termos técnicos. Foco em identificação." 
            },
            "data_criacao": { 
                "type": "STRING", 
                "description": "Categoria (Pensamento, Emoção, Sensação, Comportamento)." 
            },
            "link": { 
                "type": "STRING", 
                "description": "Link para busca no YouTube (será processado pelo front-end)." 
            },
            "tags": { 
                "type": "ARRAY", 
                "items": { "type": "STRING" } 
            }
        },
        "required": ["nome", "descricao", "explicacao_literal", "data_criacao", "link", "tags"]
    }
};

// --- 3. ENGENHARIA DE PROMPT ---
const SYSTEM_INSTRUCTION = `
Você é a IA do 'Calm.Aí', um projeto de acolhimento para neurodivergentes (Autismo e TDAH).

SUA MISSÃO:
Criar descrições que gerem IDENTIFICAÇÃO IMEDIATA e acolhimento.
Não use linguagem médica fria ("viés cognitivo", "patologia"). Use linguagem de conversa entre amigos.

DIRETRIZES PARA O CAMPO 'explicacao_literal':
- Descreva a SENSAÇÃO física e mental do dia a dia.
- Seja literal e claro.
- Exemplo BOM (Acessível): "Você fica repassando a mesma conversa na cabeça várias vezes, tentando achar onde errou. Isso te impede de dormir."
- Exemplo RUIM (Clínico): "Processo de pensamento repetitivo focado em angústias."

DIRETRIZES PARA O CAMPO 'descricao' (Card):
- Curto, direto e visual.
`;

const USER_PROMPT = `
Gere um JSON com ${TOTAL_ITENS} cards de psicoeducação sobre TCC e Neurodivergência.
Misture temas variados como: Paralisia de Escolha, Burnout Sensorial, Mascaramento (Masking), Ruminação, Ansiedade Social, Disforia Sensível à Rejeição (RSD).
`;

// --- 4. FUNÇÃO PRINCIPAL ---
async function gerarConteudo() {
    // Validação de Segurança
    if (!API_KEY) {
        console.error("❌ ERRO CRÍTICO: Chave de API não encontrada.");
        console.error("-> Verifique se você criou o arquivo .env com a GEMINI_API_KEY.");
        return;
    }

    console.log("🧠 Conectando ao cérebro do Google Gemini...");
    console.log(`📝 Solicitando ${TOTAL_ITENS} itens de psicoeducação...`);

    const payload = {
        contents: [{ parts: [{ text: USER_PROMPT }] }],
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        
        // Extrai o texto gerado pela IA
        const jsonText = result.candidates[0].content.parts[0].text;
        
        // Salva no arquivo local
        await fs.writeFile(ARQUIVO_SAIDA, jsonText, 'utf-8');
        
        console.log(`\n✨ SUCESSO COMPLETO!`);
        console.log(`📂 Arquivo '${ARQUIVO_SAIDA}' foi atualizado com novas técnicas.`);
        console.log(`🦊 O Lobo Místico está pronto para ajudar.`);

    } catch (error) {
        console.error("\n❌ OCORREU UM ERRO:");
        console.error(error.message);
    }
}

// Executa o script
gerarConteudo();