# 🚀 Guia de Deploy — NPS Dashboard Alura B2C

## Estrutura do projeto

```
nps-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── tabs/
│   │   │   ├── VisaoGeral.jsx
│   │   │   ├── Mensal.jsx
│   │   │   ├── PorPeriodo.jsx
│   │   │   ├── PorPlano.jsx
│   │   │   ├── Engajamento.jsx
│   │   │   ├── Nivel.jsx
│   │   │   ├── Risco.jsx
│   │   │   └── Detratores.jsx
│   │   ├── LoginScreen.jsx
│   │   ├── Topbar.jsx
│   │   └── Primitives.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useSheetData.js
│   ├── lib/
│   │   ├── nps.js
│   │   └── exportCsv.js
│   ├── App.jsx
│   └── index.js
├── .env.example
├── package.json
└── DEPLOY.md
```

---

## Passo 1 — Configurar a planilha do Google Sheets

1. Abra sua planilha: https://docs.google.com/spreadsheets/d/1mLESRiP1yni_zUpz9eSYnlr9aqx5qFXLGYSldubgvHc
2. Clique em **Compartilhar** (canto superior direito)
3. Em "Acesso geral", selecione **"Qualquer pessoa com o link"** → **Leitor**
4. Salve

> O dashboard usa a exportação pública de CSV do Google — não precisa de API Key.

---

## Passo 2 — Configurar as credenciais

1. Copie o arquivo `.env.example` e renomeie para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Abra o `.env.local` e edite a senha de admin:
   ```
   REACT_APP_ADMIN_PASSWORD=SuaSenhaForteAqui
   ```

> ⚠️ **Nunca commite o `.env.local`** — ele contém sua senha de admin.
> O arquivo `.gitignore` já deve bloqueá-lo automaticamente.

---

## Passo 3 — Testar localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm start
```

Acesse: http://localhost:3000

**Login padrão:** usuário `alura` / senha `alura`  
**Login admin:** usuário `alura` / senha que você definiu em `REACT_APP_ADMIN_PASSWORD`

---

## Passo 4 — Deploy no Vercel

### 4.1 — Subir o código no GitHub

```bash
git init
git add .
git commit -m "feat: nps dashboard inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/nps-dashboard.git
git push -u origin main
```

> Certifique-se de que o `.gitignore` inclui `.env.local`. Crie o arquivo se não existir:
> ```
> # .gitignore
> node_modules/
> .env.local
> build/
> ```

### 4.2 — Conectar ao Vercel

1. Acesse https://vercel.com e faça login (pode usar sua conta GitHub)
2. Clique em **"Add New Project"**
3. Importe o repositório `nps-dashboard`
4. Framework: selecione **Create React App**
5. Clique em **"Environment Variables"** e adicione:

| Nome | Valor |
|------|-------|
| `REACT_APP_SHEET_ID` | `1mLESRiP1yni_zUpz9eSYnlr9aqx5qFXLGYSldubgvHc` |
| `REACT_APP_SHEET_NAME` | `Sheet1` *(ou o nome da aba na sua planilha)* |
| `REACT_APP_USER` | `alura` |
| `REACT_APP_PASSWORD` | `alura` |
| `REACT_APP_ADMIN_PASSWORD` | *sua senha secreta* |

6. Clique em **Deploy**

---

## Passo 5 — Verificar o nome da aba da planilha

O nome da aba padrão do Google Sheets é **Sheet1** (ou **Página1** se criada em PT-BR).

Para verificar:
- Abra a planilha
- Olhe a aba na parte inferior — o nome exato deve ser o valor de `REACT_APP_SHEET_NAME`

Se o nome tiver espaços ou acentos, coloque exatamente como aparece. Exemplo: `Base NPS`.

---

## Como funciona o login

| Tipo | Usuário | Senha | Acesso |
|------|---------|-------|--------|
| Geral | `alura` | `alura` | Visualização completa |
| Admin | `alura` | *(sua senha admin)* | Visualização + botão de Refresh |

Para trocar as credenciais, basta atualizar as variáveis de ambiente no Vercel e fazer um novo deploy.

---

## Como atualizar os dados (Admin)

1. Faça o update na planilha do Google Sheets
2. Acesse o dashboard com o **login de admin**
3. Clique em **⚙ Admin → ↻ Atualizar dados**
4. O dashboard vai rebuscar o CSV da planilha e recalcular tudo

---

## Funcionalidades incluídas

- ✅ Login com senha (geral e admin)
- ✅ 8 abas completas: Visão Geral, Mês a Mês, Ciclo, Planos, Engajamento, Nível do Aluno, Risco de Churn, Detratores
- ✅ Filtro global por mês (survey_date)
- ✅ Filtros combinados na aba Detratores
- ✅ Exportação CSV (com o filtro de mês ativo)
- ✅ Botão de refresh exclusivo para o admin
- ✅ Dados buscados diretamente do Google Sheets via exportação pública CSV
- ✅ Processamento 100% local (nenhum dado vai para servidor externo)

---

## Dúvidas frequentes

**O dashboard carregou mas está vazio / dando erro de colunas**
→ Verifique se `REACT_APP_SHEET_NAME` corresponde exatamente ao nome da aba na planilha.

**Deu erro "Failed to fetch"**
→ Verifique se a planilha está com acesso público de leitura (Passo 1).

**Quero mudar a senha de admin**
→ Altere `REACT_APP_ADMIN_PASSWORD` nas variáveis de ambiente do Vercel e clique em "Redeploy".

**Quero adicionar mais usuários**
→ Por enquanto o sistema suporta um usuário padrão. Para múltiplos usuários, precisaríamos evoluir para um backend com banco de dados (Supabase, por exemplo).
