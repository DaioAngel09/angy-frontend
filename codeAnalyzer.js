require('dotenv').config(); // Carrega variáveis do .env
const fs = require('fs');
const OpenAI = require('openai');
const eslint = require('eslint');

// Verifica se a API Key foi carregada
if (!process.env.OPENAI_API_KEY) {
  console.error("⚠️ ERRO: A chave OPENAI_API_KEY não está definida! Verifique o arquivo .env.");
  process.exit(1); // Sai do programa
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeCode(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf-8');
    const linter = new eslint.ESLint({ fix: true });
    const results = await linter.lintText(code);
    
    let formattedCode = results[0].output || code;
    fs.writeFileSync(filePath, formattedCode, 'utf-8');

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Você é um assistente de código que analisa e melhora código React e Node.js.' },
        { role: 'user', content: `Analise e sugira melhorias para este código:\n${code}` },
      ],
    });

    console.log('Sugestões de melhoria:', response.choices[0].message.content);
  } catch (error) {
    console.error('Erro ao analisar código:', error);
  }
}

// Teste a execução
//analyzeCode('./src/components/Exemplo.js');


// Exemplo de uso: analisar um arquivo específico
analyzeCode('./src/pages/Dashboard.js');
