# 🚀 AvaliaCar

**AvaliaCar** é uma plataforma intuitiva e completa para **pesquisa de preços de veículos**, **avaliação de mercado** e **simulação de financiamentos**.  
Com uma interface moderna, o projeto visa simplificar o processo de compra e venda de veículos, oferecendo **dados oficiais da Tabela FIPE** e ferramentas inteligentes para tomada de decisão.

---

## 🌐 Live Demo
🔗 Acesse o projeto em produção:  
👉 [avaliacar.barbosa.zip](https://avaliacar.barbosa.zip)

---

## ✨ Principais Funcionalidades

A plataforma foi projetada para ser simples e direta, permitindo uso imediato sem necessidade de login inicial.

- **Acesso Anônimo**
  - Pesquise valores de mercado (Tabela FIPE).
  - Avalie preços com base em quilometragem e condição do veículo.
  - Simule opções de financiamento.

- **Acesso Autenticado (Login via Google)**
  - 🔑 **Login Simplificado**: Exclusivamente com Google, rápido e seguro.
  - 📢 **Anúncio de Veículos**: Usuários logados podem anunciar veículos.
  - 📜 **Histórico de Consultas**: Usuários autenticados têm acesso às últimas 3 pesquisas realizadas.

---

## 🛠️ Stack Tecnológica

O projeto foi desenvolvido com a **T3 Stack**, garantindo performance e escalabilidade.

### Frontend
- ⚛️ **Next.js** – Framework React com App Router e SSR.  
- 🟦 **TypeScript** – Tipagem estática e segura.  
- 🎨 **Tailwind CSS** – Estilização rápida e responsiva.  
- 🧩 **Shadcn UI** – Componentes acessíveis e modernos.  

### Backend & API
- 🔗 **tRPC** – APIs seguras e tipadas de ponta a ponta.  
- 🗄️ **Prisma** – ORM moderno para modelagem e acesso ao banco.  

### Banco de Dados
- 🟢 **Neon DB** – PostgreSQL serverless, otimizado para alta disponibilidade.  

### Infraestrutura
- ▲ **Vercel** – Deploy automático e eficiente.  

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
