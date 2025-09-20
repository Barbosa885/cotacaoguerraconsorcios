# 🚗 AvaliaCar

O **AvaliaCar** é uma plataforma feita para facilitar a vida de quem quer **comprar ou vender um veículo**.  
Com uma interface simples e moderna, ele permite consultar preços da **Tabela FIPE**, avaliar o valor real de um veículo e até simular diferentes opções de financiamento.
Além de permitir o usuário anunciar seu veículo pelo valor avaliado.  

---

## 🌐 Live Demo
🔗 Acesse o projeto em produção:  
👉 [avaliacar.barbosa.zip](https://avaliacar.barbosa.zip)

---

## ✅ Requisitos do Desafio

A aplicação foi desenvolvida para atender a todos os requisitos obrigatórios e desejáveis especificados no desafio técnico.

### Requisitos Obrigatórios
- [x] **Formulário de Contato:** Implementado tanto na página `/fale-conosco` quanto na tela de avaliação e financiamento.  
- [x] **Responsividade:** O design é totalmente responsivo, garantindo uma experiência otimizada em telas de celulares e notebooks.  
- [x] **Inclusão da Logo:** A logo da empresa está presente de forma proeminente no cabeçalho em todas as páginas e em alguns formulários específicos.  
- [x] **Stack Tecnológica:** Desenvolvido com **Next.js**, **TypeScript** e componentes **Shadcn UI**, conforme solicitado.  

### Aspectos Desejáveis
- [x] **Simulação Financeira:** Funcionalidade para calcular valores de parcelas na página **Avalie & Simule**.  
- [x] **Tratamento de Erros:** Requisições à API e login possuem tratamento de erros com **feedback visual via toast** do Shadcn UI.  
- [x] **Tratamento de Requisições à API:** Consumo da API da FIPE via **tRPC**.

---

## ✨ Principais Funcionalidades

A ideia foi criar algo **direto e prático**, que qualquer pessoa consiga usar sem complicação.  

- **Sem login (Acesso Anônimo)**  
  - Pesquise preços da Tabela FIPE.  
  - Avalie o valor de um carro levando em conta quilometragem e condição.  
  - Simule financiamentos de forma rápida.  

- **Com login (Google)**  
  - 🔑 Login simples e seguro usando apenas sua conta do Google.  
  - 📢 Anuncie seus veículos na plataforma.  
  - 📜 Consulte seu **histórico das últimas 3 pesquisas** feitas. 

---

## 🛠️ Stack utilizada

O projeto foi desenvolvido com a **T3 Stack**.

### Frontend
- ⚛️ **Next.js**  
- 🟦 **TypeScript**
- 🎨 **Tailwind CSS**
- 🧩 **Shadcn UI** 

### Backend & API
- 🔗 **tRPC**
- 🗄️ **Prisma**

### Banco de Dados
- 🟢 **Neon DB** – PostgreSQL serverless, otimizado para alta disponibilidade.  

### Infraestrutura
- ▲ **Vercel** – Deploy.  

---

## ⚙️ Como Rodar Localmente

1. **Clone o repositório**
   ```bash
   git clone [COLOQUE O LINK DO SEU REPOSITÓRIO]
    ```

2.**Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente**
- Crie um arquivo `.env` na raiz do projeto.
- Adicione as variáveis necessárias:
```bash
DATABASE_URL="[SUA URL DO BANCO DE DADOS]"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[CHAVE SECRETA]"
GOOGLE_CLIENT_ID="[ID DO CLIENTE DO GOOGLE]"
GOOGLE_CLIENT_SECRET="[SEGREDO DO CLIENTE DO GOOGLE]"
```

4. **Execute as migrações do Prisma**
```bash
npx prisma db push
```

5. **Inicie o servidor**
```bash
npm run dev
```

## 📝 Próximos Passos & Melhorias
  - 💬 Comunicação Direta – Implementar chat entre vendedores e interessados.
  - 🛒 Gestão de Anúncios – CRUD completo (edição e exclusão).
