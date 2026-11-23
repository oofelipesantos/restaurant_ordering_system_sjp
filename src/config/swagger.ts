const idParameter = {
    name: "id",
    in: "path",
    required: true,
    description: "Identificador UUID do registro",
    schema: { type: "string", format: "uuid" },
};

const errorContent = {
    "application/json": {
        schema: { $ref: "#/components/schemas/Error" },
    },
};

const commonErrors = {
    400: { description: "Dados inválidos", content: errorContent },
    404: { description: "Registro não encontrado", content: errorContent },
    409: { description: "Conflito com uma regra de negócio", content: errorContent },
    500: { description: "Erro interno do servidor", content: errorContent },
};

const swaggerSpec = {
    openapi: "3.0.3",
    info: {
        title: "Restaurant Ordering System API",
        version: "2.0.0",
        description:
            "API REST para gerenciamento de categorias, produtos, pedidos e itens de pedidos.",
    },
    servers: [
        { url: "/", description: "Servidor atual" },
        { url: "http://localhost:3000", description: "Desenvolvimento local" },
    ],
    tags: [
        { name: "Categories", description: "Gerenciamento de categorias" },
        { name: "Products", description: "Gerenciamento de produtos" },
        { name: "Orders", description: "Gerenciamento de pedidos" },
        { name: "Order Items", description: "Gerenciamento dos itens dos pedidos" },
    ],
    paths: {
        "/categories": {
            get: {
                tags: ["Categories"],
                summary: "Listar categorias",
                responses: {
                    200: {
                        description: "Lista de categorias",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Category" },
                                },
                            },
                        },
                    },
                    500: commonErrors[500],
                },
            },
            post: {
                tags: ["Categories"],
                summary: "Criar categoria",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CategoryInput" },
                            example: {
                                name: "Pizzas",
                                description: "Pizzas tradicionais e especiais",
                                icon: "🍕",
                                display_order: 1,
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Categoria criada",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Category" },
                            },
                        },
                    },
                    ...commonErrors,
                },
            },
        },
        "/categories/search": {
            get: {
                tags: ["Categories"],
                summary: "Pesquisar categorias por palavra-chave",
                parameters: [
                    {
                        name: "keyword",
                        in: "query",
                        required: true,
                        schema: { type: "string", example: "pizza" },
                    },
                ],
                responses: {
                    200: {
                        description: "Categorias encontradas",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Category" },
                                },
                            },
                        },
                    },
                    400: commonErrors[400],
                    500: commonErrors[500],
                },
            },
        },
        "/categories/{id}": {
            get: {
                tags: ["Categories"],
                summary: "Consultar categoria por ID",
                parameters: [idParameter],
                responses: {
                    200: {
                        description: "Categoria encontrada",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Category" },
                            },
                        },
                    },
                    ...commonErrors,
                },
            },
            put: {
                tags: ["Categories"],
                summary: "Atualizar categoria",
                parameters: [idParameter],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CategoryUpdate" },
                            example: { description: "Descrição atualizada", active: false },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Categoria atualizada",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Category" },
                            },
                        },
                    },
                    ...commonErrors,
                },
            },
            delete: {
                tags: ["Categories"],
                summary: "Excluir categoria",
                parameters: [idParameter],
                responses: {
                    200: { description: "Categoria removida" },
                    ...commonErrors,
                },
            },
        },
        "/products": {
            get: {
                tags: ["Products"],
                summary: "Listar produtos",
                responses: {
                    200: {
                        description: "Lista de produtos",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Product" },
                                },
                            },
                        },
                    },
                    500: commonErrors[500],
                },
            },
            post: {
                tags: ["Products"],
                summary: "Criar produto",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProductInput" },
                            example: {
                                category_id: "550e8400-e29b-41d4-a716-446655440000",
                                title: "Pizza Margherita",
                                description: "Molho, mussarela e manjericão",
                                price: 39.9,
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Produto criado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Product" },
                            },
                        },
                    },
                    ...commonErrors,
                },
            },
        },
        "/products/search": {
            get: {
                tags: ["Products"],
                summary: "Pesquisar produtos por palavra-chave",
                parameters: [
                    {
                        name: "keyword",
                        in: "query",
                        required: true,
                        schema: { type: "string", example: "pizza" },
                    },
                ],
                responses: {
                    200: {
                        description: "Produtos encontrados",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Product" },
                                },
                            },
                        },
                    },
                    400: commonErrors[400],
                    500: commonErrors[500],
                },
            },
        },
        "/products/{id}": {
            get: {
                tags: ["Products"],
                summary: "Consultar produto por ID",
                parameters: [idParameter],
                responses: {
                    200: {
                        description: "Produto encontrado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Product" },
                            },
                        },
                    },
                    ...commonErrors,
                },
            },
            put: {
                tags: ["Products"],
                summary: "Atualizar produto",
                parameters: [idParameter],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProductUpdate" },
                            example: { price: 42.9, available: false },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Produto atualizado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Product" },
                            },
                        },
                    },
                    ...commonErrors,
                },
            },
            delete: {
                tags: ["Products"],
                summary: "Excluir produto",
                parameters: [idParameter],
                responses: {
                    200: { description: "Produto removido" },
                    ...commonErrors,
                },
            },
        },
        "/orders": {
            get: {
                tags: ["Orders"],
                summary: "Listar pedidos",
                responses: {
                    200: {
                        description: "Lista de pedidos",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Order" },
                                },
                            },
                        },
                    },
                    500: commonErrors[500],
                },
            },
            post: {
                tags: ["Orders"],
                summary: "Criar pedido pendente",
                responses: {
                    201: {
                        description: "Pedido criado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Order" },
                            },
                        },
                    },
                    500: commonErrors[500],
                },
            },
        },
        "/orders/{id}": {
            get: {
                tags: ["Orders"],
                summary: "Consultar pedido, itens e total",
                parameters: [idParameter],
                responses: {
                    200: {
                        description: "Pedido encontrado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/OrderDetails" },
                            },
                        },
                    },
                    ...commonErrors,
                },
            },
            put: {
                tags: ["Orders"],
                summary: "Atualizar status do pedido",
                description:
                    "Transições permitidas: pending → preparing/cancelled; preparing → ready/cancelled; ready → delivered.",
                parameters: [idParameter],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["status"],
                                properties: {
                                    status: {
                                        type: "string",
                                        enum: ["pending", "preparing", "ready", "delivered", "cancelled"],
                                    },
                                },
                            },
                            example: { status: "preparing" },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Status atualizado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Order" },
                            },
                        },
                    },
                    ...commonErrors,
                },
            },
            delete: {
                tags: ["Orders"],
                summary: "Excluir pedido",
                description: "Pedidos entregues não podem ser excluídos.",
                parameters: [idParameter],
                responses: {
                    200: { description: "Pedido removido" },
                    ...commonErrors,
                },
            },
        },
        "/order-items": {
            get: {
                tags: ["Order Items"],
                summary: "Listar itens, com filtro opcional por pedido",
                parameters: [
                    {
                        name: "order_id",
                        in: "query",
                        required: false,
                        schema: { type: "string", format: "uuid" },
                    },
                ],
                responses: {
                    200: {
                        description: "Lista de itens",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/OrderItem" },
                                },
                            },
                        },
                    },
                    400: commonErrors[400],
                    500: commonErrors[500],
                },
            },
            post: {
                tags: ["Order Items"],
                summary: "Adicionar produto a um pedido pendente",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/OrderItemInput" },
                            example: {
                                order_id: "550e8400-e29b-41d4-a716-446655440001",
                                product_id: "550e8400-e29b-41d4-a716-446655440002",
                                quantity: 2,
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Item criado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/OrderItem" },
                            },
                        },
                    },
                    ...commonErrors,
                },
            },
        },
        "/order-items/{id}": {
            get: {
                tags: ["Order Items"],
                summary: "Consultar item por ID",
                parameters: [idParameter],
                responses: {
                    200: {
                        description: "Item encontrado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/OrderItem" },
                            },
                        },
                    },
                    ...commonErrors,
                },
            },
            put: {
                tags: ["Order Items"],
                summary: "Atualizar quantidade do item",
                parameters: [idParameter],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["quantity"],
                                properties: {
                                    quantity: { type: "integer", minimum: 1 },
                                },
                            },
                            example: { quantity: 3 },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Item atualizado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/OrderItem" },
                            },
                        },
                    },
                    ...commonErrors,
                },
            },
            delete: {
                tags: ["Order Items"],
                summary: "Excluir item do pedido",
                parameters: [idParameter],
                responses: {
                    200: { description: "Item removido" },
                    ...commonErrors,
                },
            },
        },
    },
    components: {
        schemas: {
            Error: {
                type: "object",
                required: ["message"],
                properties: { message: { type: "string" } },
            },
            CategoryInput: {
                type: "object",
                required: ["name", "display_order"],
                properties: {
                    name: { type: "string" },
                    description: { type: "string", nullable: true },
                    icon: { type: "string", nullable: true },
                    display_order: { type: "integer", minimum: 0 },
                    active: { type: "boolean", default: true },
                },
            },
            CategoryUpdate: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    description: { type: "string", nullable: true },
                    icon: { type: "string", nullable: true },
                    display_order: { type: "integer", minimum: 0 },
                    active: { type: "boolean" },
                },
            },
            Category: {
                allOf: [
                    { $ref: "#/components/schemas/CategoryInput" },
                    {
                        type: "object",
                        required: ["id", "active"],
                        properties: { id: { type: "string", format: "uuid" } },
                    },
                ],
            },
            ProductInput: {
                type: "object",
                required: ["category_id", "title", "price"],
                properties: {
                    category_id: { type: "string", format: "uuid" },
                    title: { type: "string" },
                    description: { type: "string", nullable: true },
                    price: { type: "number", minimum: 0 },
                    image: { type: "string", nullable: true },
                    available: { type: "boolean", default: true },
                    active: { type: "boolean", default: true },
                },
            },
            ProductUpdate: {
                type: "object",
                properties: {
                    category_id: { type: "string", format: "uuid" },
                    title: { type: "string" },
                    description: { type: "string", nullable: true },
                    price: { type: "number", minimum: 0 },
                    image: { type: "string", nullable: true },
                    available: { type: "boolean" },
                    active: { type: "boolean" },
                },
            },
            Product: {
                allOf: [
                    { $ref: "#/components/schemas/ProductInput" },
                    {
                        type: "object",
                        required: ["id", "available", "active"],
                        properties: { id: { type: "string", format: "uuid" } },
                    },
                ],
            },
            Order: {
                type: "object",
                required: ["id", "status", "created_at"],
                properties: {
                    id: { type: "string", format: "uuid" },
                    status: {
                        type: "string",
                        enum: ["pending", "preparing", "ready", "delivered", "cancelled"],
                    },
                    created_at: { type: "string", format: "date-time" },
                },
            },
            OrderDetails: {
                allOf: [
                    { $ref: "#/components/schemas/Order" },
                    {
                        type: "object",
                        properties: {
                            order_items: {
                                type: "array",
                                items: { $ref: "#/components/schemas/OrderItem" },
                            },
                            total: { type: "number", example: 79.8 },
                        },
                    },
                ],
            },
            OrderItemInput: {
                type: "object",
                required: ["order_id", "product_id", "quantity"],
                properties: {
                    order_id: { type: "string", format: "uuid" },
                    product_id: { type: "string", format: "uuid" },
                    quantity: { type: "integer", minimum: 1 },
                },
            },
            OrderItem: {
                allOf: [
                    { $ref: "#/components/schemas/OrderItemInput" },
                    {
                        type: "object",
                        required: ["id", "unit_price"],
                        properties: {
                            id: { type: "string", format: "uuid" },
                            unit_price: { type: "number", minimum: 0 },
                        },
                    },
                ],
            },
        },
    },
};

export default swaggerSpec;
