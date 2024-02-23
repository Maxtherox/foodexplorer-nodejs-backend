# Food Explorer - Documentação de Utilização

## Visão Geral

Bem-vindo ao Food Explorer, uma aplicação em Node.js em desenvolvimento que permite gerenciar pratos, ingredientes, categorias e favoritos de usuários. Esta documentação fornecerá uma visão geral da aplicação, instruções de configuração e como utilizar suas funcionalidades.

Você pode ver as prints da aplicação no repositório de seu
[Frontend.](https://github.com/Maxtherox/foodexplorer-react-frontend?tab=readme-ov-file)

[Deploy Frontend](https://main--foodexplorer-maxtr.netlify.app/)

## Pré-requisitos

- Node.js instalado (versão recomendada: 14.x ou superior)
- NPM (Node Package Manager) ou Yarn instalado
- Banco de dados SQLite (instalado automaticamente com a aplicação)

## Instalação

1. Clone o repositório do GitHub:

   ```bash
   git clone https://github.com/seu-usuario/food-explorer.git
   ```

2. Acesse o diretório do projeto:

   ```bash
   cd food-explorer
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

   ou

   ```bash
   yarn install
   ```

4. Execute as migrações do banco de dados para criar as tabelas necessárias:

   ```bash
   npm run migrate
   ```

   ou

   ```bash
   yarn migrate
   ```

## Configuração

1. Abra o arquivo `knexfile.js` e ajuste a configuração do banco de dados conforme necessário.

2. Certifique-se de que o banco de dados SQLite está configurado corretamente no arquivo `knexfile.js`.

## Uso

A aplicação fornece uma API para interação. Abaixo estão os principais pontos de entrada:

- **`POST /users`**: Cria um novo usuário. Requer um corpo de requisição contendo `name`, `email` e `password`.

- **`PUT /users/:id`**: Atualiza as informações de um usuário existente. Requer um corpo de requisição com as informações a serem atualizadas.

- **`POST /foods/:user_id`**: Cria um novo prato. Requer um corpo de requisição contendo informações sobre o prato, como `name`, `description`, `price`, `ingredients` e `categories`.

- **`GET /foods/:id`**: Retorna informações detalhadas sobre um prato específico.

- **`GET /foods?user_id=:user_id&name=:name&ingredients=:ingredients`**: Retorna uma lista de pratos filtrados com base nos parâmetros fornecidos.

- **`DELETE /foods/:id`**: Deleta um prato específico.

- **`POST /favorites`**: Favorita um prato para um usuário. Requer um corpo de requisição com `user_id` e `food_id`.

- **`GET /favorites/:id`**: Retorna a lista de pratos favoritos de um usuário específico.

- **`GET /categories?user_id=:user_id`**: Retorna a lista de categorias de um usuário específico.

## Exemplos de Uso

### Criar um Usuário

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}' http://localhost:3333/users
```

### Criar um Prato

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name": "Pizza", "description": "Delicious pizza", "price": 15.99, "ingredients": ["Dough", "Tomato Sauce", "Cheese"], "categories": ["Italian"], "user_id": 1}' http://localhost:3333/foods/1
```

### Obter Detalhes de um Prato

```bash
curl http://localhost:3333/foods/1
```

### Listar Pratos com Filtros

```bash
curl "http://localhost:3333/foods?user_id=1&name=Pizza&ingredients=Dough,Tomato%20Sauce"
```

### Favoritar um Prato

```bash
curl -X POST -H "Content-Type: application/json" -d '{"user_id": 1, "food_id": 1}' http://localhost:3333/favorites
```

### Obter Pratos Favoritos de um Usuário

```bash
curl http://localhost:3333/favorites/1
```

### Obter Categorias de um Usuário

```bash
curl "http://localhost:3333/categories?user_id=1"
```

## Considerações Finais

O Food Explorer é uma aplicação em constante desenvolvimento. Sinta-se à vontade para contribuir, reportar problemas ou sugerir melhorias. Agradecemos por usar o Food Explorer! 🍲✨
