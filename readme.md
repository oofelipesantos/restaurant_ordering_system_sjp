# Restaurant Ordering System 🍕

API REST desenvolvida em **Node.js, Express e TypeScript**, com integração ao **Supabase (PostgreSQL)**.

O projeto simula um sistema de autoatendimento para restaurantes, permitindo o gerenciamento de categorias, produtos, pedidos e itens dos pedidos.

Desenvolvido como atividade prática da disciplina de Desenvolvimento Back-End do curso de Engenharia de Software.

## 1. Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Supabase
- PostgreSQL
- Postman
- Git e GitHub

## 2. Funcionalidades

O sistema permite:

- Cadastrar, listar, consultar, atualizar e excluir categorias.
- Pesquisar categorias por palavra-chave.
- Cadastrar, listar, consultar, atualizar e excluir produtos.
- Criar e gerenciar pedidos.
- Adicionar produtos aos pedidos.
- Atualizar a quantidade de cada produto no pedido.
- Consultar os itens e o valor total de um pedido.
- Atualizar o status de um pedido.
- Excluir pedidos e itens dos pedidos.

## 3. Estrutura do projeto

```text
src/
├── config/
│   └── supabase.ts
├── controller/
│   ├── CategoryController.ts
│   ├── ProductController.ts
│   ├── OrderController.ts
│   └── OrderItemController.ts
├── model/
│   ├── Category.ts
│   └── Product.ts
├── repositories/
│   ├── CategoryRepository.ts
│   ├── ProductRepository.ts
│   ├── OrderRepository.ts
│   └── OrderItemRepository.ts
├── routes/
│   ├── categoryRoutes.ts
│   ├── productRoutes.ts
│   ├── orderRoutes.ts
│   └── orderItemRoutes.ts
├── app.ts
└── server.ts
```

O projeto utiliza uma arquitetura organizada em camadas:

- **Routes:** definem os endpoints disponíveis.
- **Controllers:** recebem e validam as requisições HTTP.
- **Repositories:** realizam as operações de acesso ao Supabase.
- **Models:** representam as entidades e estruturas de dados da aplicação.

Essa organização facilita a manutenção e a separação das responsabilidades do código.

## 4. Banco de dados

O banco de dados utiliza PostgreSQL, hospedado no Supabase.

### Tabela categories

Armazena as categorias dos produtos.

Principais campos:

- `id` — identificador UUID.
- `name` — nome da categoria.
- `description` — descrição.
- `icon` — ícone.
- `display_order` — ordem de exibição.
- `active` — indica se a categoria está ativa.

### Tabela products

Armazena os produtos cadastrados no restaurante.

Principais campos:

- `id` — identificador UUID.
- `category_id` — referência à categoria.
- `title` — nome do produto.
- `description` — descrição do produto.
- `price` — preço.
- `image` — imagem do produto.
- `available` — disponibilidade.
- `active` — situação do cadastro.

### Tabela orders

Armazena os pedidos realizados.

Principais campos:

- `id` — identificador UUID.
- `status` — status atual do pedido.
- `created_at` — data de criação.

Os status disponíveis são:

- `pending` — pedido pendente.
- `preparing` — em preparação.
- `ready` — pronto.
- `delivered` — entregue.
- `cancelled` — cancelado.

### Tabela order_items

Armazena os produtos pertencentes a cada pedido.

Principais campos:

- `id` — identificador UUID.
- `order_id` — referência ao pedido.
- `product_id` — referência ao produto.
- `quantity` — quantidade solicitada.
- `unit_price` — preço unitário registrado no pedido.

### Relacionamentos

- Uma categoria pode possuir vários produtos.
- Um pedido pode possuir vários itens.
- Cada item pertence a um pedido.
- Cada item referencia um produto.

Os relacionamentos são realizados por chaves estrangeiras e identificadores UUID.

Na tabela `order_items`, a exclusão de um pedido remove também seus itens associados.

## 5. Instalação e execução

### Pré-requisitos

- Node.js e npm instalados.
- Projeto configurado no Supabase.
- Tabelas criadas no banco de dados.

### Clonar o repositório

```bash
git clone https://github.com/oofelipesantos/restaurant_ordering_system_sjp.git
```

Entrar na pasta:

```bash
cd restaurant_ordering_system_sjp
```

Acessar a branch de desenvolvimento da APS:

```bash
git switch aps-desenvolvimento-felipe-santos
```

Instalar as dependências:

```bash
npm install
```

### Configurar o Supabase

Criar um arquivo `.env` na raiz do projeto, com as variáveis de ambiente exigidas pelo arquivo `src/config/supabase.ts`.

As credenciais devem ser obtidas no painel do Supabase. As chaves secretas não devem ser publicadas no GitHub.

### Executar a aplicação

```bash
npm run dev
```

Por padrão, nos testes realizados, a API foi acessada em:

`http://localhost:3000`

### Verificar o TypeScript

```bash
npx tsc --noEmit
```

## 6. Endpoints da API

### Categories

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/categories` | Lista as categorias |
| GET | `/categories/search?keyword=Pizza` | Pesquisa categorias |
| GET | `/categories/:id` | Busca categoria pelo ID |
| POST | `/categories` | Cria categoria |
| PUT | `/categories/:id` | Atualiza categoria |
| DELETE | `/categories/:id` | Exclui categoria |

Exemplo de JSON para criar categoria:

```json
{
  "name": "Pizza",
  "description": "Pizzas tradicionais",
  "icon": "🍕",
  "display_order": 1,
  "active": true
}
```

### Products

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/products` | Lista produtos |
| GET | `/products/:id` | Busca produto pelo ID |
| POST | `/products` | Cria produto |
| PUT | `/products/:id` | Atualiza produto |
| DELETE | `/products/:id` | Exclui produto |

Exemplo de JSON para criar produto:

```json
{
  "category_id": "UUID_DA_CATEGORIA",
  "title": "Mussarela Especial",
  "description": "Pizza com quatro queijos",
  "price": 39.99,
  "image": null,
  "available": true,
  "active": true
}
```

### Orders

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/orders` | Lista pedidos |
| GET | `/orders/:id` | Consulta pedido e total |
| POST | `/orders` | Cria pedido |
| PUT | `/orders/:id` | Atualiza status |
| DELETE | `/orders/:id` | Exclui pedido |

O POST `/orders` não precisa de Body. O sistema cria um pedido com status `pending`.

Exemplo de JSON para atualizar o status:

```json
{
  "status": "preparing"
}
```

### Order Items

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/order-items` | Lista itens |
| GET | `/order-items/:id` | Busca item pelo ID |
| GET | `/order-items?order_id=UUID` | Lista itens de um pedido |
| POST | `/order-items` | Adiciona produto ao pedido |
| PUT | `/order-items/:id` | Atualiza quantidade |
| DELETE | `/order-items/:id` | Exclui item |

Exemplo de JSON para criar um item:

```json
{
  "order_id": "UUID_DO_PEDIDO",
  "product_id": "UUID_DO_PRODUTO",
  "quantity": 2
}
```

O preço unitário é obtido automaticamente da tabela `products` no momento do cadastro do item.

Exemplo de JSON para atualizar quantidade:

```json
{
  "quantity": 3
}
```

## 7. Exemplo de funcionamento

O fluxo básico de utilização é:

1. Cadastrar uma categoria, como Pizza.
2. Cadastrar um produto vinculado à categoria.
3. Criar um pedido.
4. Adicionar o produto ao pedido, informando a quantidade.
5. Consultar o pedido e seu valor total.
6. Atualizar o status durante o preparo.
7. Finalizar ou cancelar o pedido.

Por exemplo, um pedido com quatro pizzas no valor unitário de R$ 39,99 apresenta um total de **R$ 159,96**.

O total é calculado utilizando a quantidade e o preço unitário de cada item.

## 8. Testes realizados

A API foi testada com o Postman, verificando:

- Consultas GET.
- Cadastros POST.
- Atualizações PUT.
- Exclusões DELETE.
- Persistência de dados no Supabase.
- Relacionamentos entre pedidos, itens e produtos.
- Cálculo do valor total dos pedidos.
- Respostas HTTP e validações de dados.

## 9. Observações

O projeto é uma API de caráter acadêmico e não possui interface gráfica, autenticação de usuários ou integração com pagamentos.

O objetivo é demonstrar o desenvolvimento de uma API REST utilizando TypeScript, Express, PostgreSQL e organização do código em camadas.

## 10. Autor

**Felipe Santos**

Projeto desenvolvido como atividade prática da disciplina de Desenvolvimento Back-End — Engenharia de Software.

Repositório: https://github.com/oofelipesantos/restaurant_ordering_system_sjp
