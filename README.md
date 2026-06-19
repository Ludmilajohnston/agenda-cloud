# 📇 Agenda Digital - CRUD de Contatos

[![Status](https://img.shields.io/badge/status-finalizado-success)](https://github.com/ludmilajohnston/agenda-cloud)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)](https://supabase.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

Aplicação web para gerenciamento de contatos com **autenticação de usuários** e **integração com banco de dados na nuvem** (Supabase/PostgreSQL). Desenvolvida para a disciplina de **Desenvolvimento de Aplicação em Nuvem**.

---

## Acesse a Aplicação

🔗 **[https://ludmilajohnston.github.io/agenda-cloud/](https://ludmilajohnston.github.io/agenda-cloud/)**

---

## Integrantes

| Nome | GitHub |
|------|--------|
| **Ludmila Johnston** | [@ludmilajohnston](https://github.com/ludmilajohnston) |

---

## Funcionalidades

### Autenticação
- Login com e-mail e senha
- Cadastro de novos usuários
- Login como convidado (anônimo)
- Logout seguro
- Sessão persistente

### CRUD de Contatos
| Operação | Descrição | Status |
|----------|-----------|--------|
| **C**riar | Adicionar novos contatos com nome, telefone e e-mail | ✅ |
| **R**ead | Listar todos os contatos do usuário logado | ✅ |
| **U**pdate | Editar contatos existentes | ✅ |
| **D**elete | Excluir contatos com confirmação | ✅ |

### Busca
- Busca por nome em tempo real
- Filtro case-insensitive

### Segurança
- **Row Level Security (RLS)** configurado no Supabase
- Cada usuário visualiza e gerencia **apenas seus próprios contatos**
- Validação de dados no frontend e backend
- Proteção contra acesso não autorizado

---

## Tecnologias Utilizadas

| Tecnologia | Descrição |
|------------|-----------|
| **HTML5** | Estrutura semântica da aplicação |
| **CSS3** | Estilização responsiva com design moderno e variáveis CSS |
| **JavaScript (Vanilla)** | Lógica de negócio e interações |
| **Supabase** | Backend como serviço (BaaS) com PostgreSQL |
| **Supabase Auth** | Autenticação de usuários |
| **Supabase RLS** | Segurança em nível de linha |
| **GitHub Pages** | Hospedagem da aplicação |

---

## Estrutura do Banco de Dados

### Tabela: `contato`

```sql
CREATE TABLE contato (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(25) NOT NULL,
    obs VARCHAR(255),
    dtcontato DATE,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contato_user_id ON contato(user_id);
