# Agenda Digital

Aplicação web CRUD para gerenciamento de contatos utilizando HTML5, CSS3, JavaScript e Supabase.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript Vanilla
- Supabase
- GitHub Pages

## Funcionalidades

- Cadastro de contatos
- Listagem de contatos
- Edição de contatos
- Exclusão de contatos
- Integração com banco de dados em nuvem

## Banco de Dados

O projeto utiliza o Supabase com PostgreSQL.

Tabela utilizada:

```sql
CREATE TABLE contato (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(25),
  obs VARCHAR(255),
  dtcontato DATE
);
