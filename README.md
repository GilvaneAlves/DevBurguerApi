# DevBurguer API

API RESTful desenvolvida em **Node.js** para gerenciamento de usuários e produtos de uma hamburgueria.  
O sistema permite cadastro e autenticação de usuários com JWT, upload de imagens de produtos e listagem completa dos produtos cadastrados.

---

## Tecnologias Utilizadas

- Node.js
- Express
- Sequelize + PostgreSQL
- Multer
- Yup
- JWT (JSON Web Token)
- BcryptJS
- Dotenv

---

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/GilvaneAlves/DevBurguerApi.git
cd DevBurguerApi
pnpm install
```

---

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as variáveis abaixo:

```bash
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=devburguer
DB_PORT=5432
JWT_SECRET=sua_chave_secreta
```

---

## Banco de Dados

Execute as migrations para criar as tabelas:

```bash
pnpm sequelize db:migrate
```

---

## Executando o Projeto

```bash
pnpm dev
```

A API estará disponível em:  
http://localhost:3001

---

## Rotas Principais

### Autenticação

| Método | Rota      | Descrição                    |
|--------|------------|------------------------------|
| POST   | /users     | Cadastro de novo usuário     |
| POST   | /session   | Login e geração de token JWT |

---

### Produtos (requer token JWT)

| Método | Rota        | Descrição                             |
|--------|--------------|---------------------------------------|
| POST   | /products    | Cadastrar produto com imagem          |
| GET    | /products    | Listar produtos                       |

**Header obrigatório:**  
`Authorization: Bearer SEU_TOKEN`

---

## Upload de Imagens

As imagens são armazenadas na pasta `/uploads` e podem ser acessadas via:

```
GET /product-file/:filename
```

---

## Autor

Desenvolvido por [Gilvane Alves](https://github.com/GilvaneAlves)

---

## Licença

Este projeto é de uso livre para fins de estudo e demonstração.
