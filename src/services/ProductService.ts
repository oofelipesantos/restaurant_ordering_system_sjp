import { NotFoundError, ValidationError } from "../errors/AppError.js";
import { Product, type ProductInput, type ProductRecord } from "../model/Product.js";
import CategoryRepository, { type CategoryRepositoryContract } from "../repositories/CategoryRepository.js";
import ProductRepository, { type ProductRepositoryContract } from "../repositories/ProductRepository.js";
import { requiredString, uuid } from "../utils/validation.js";

function asInput(value: unknown): ProductInput {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new ValidationError("Os dados do produto são inválidos.");
    }

    return value as ProductInput;
}

export class ProductService {
    constructor(
        private readonly repository: ProductRepositoryContract = ProductRepository,
        private readonly categoryRepository: CategoryRepositoryContract = CategoryRepository,
    ) {}

    async list(): Promise<ProductRecord[]> {
        return this.repository.findAll();
    }

    async getById(id: unknown): Promise<ProductRecord> {
        const product = await this.repository.findById(
            uuid(id, "O identificador do produto"),
        );

        if (!product) {
            throw new NotFoundError("Produto não encontrado.");
        }

        return product;
    }

    async search(keyword: unknown): Promise<ProductRecord[]> {
        return this.repository.searchByKeyword(
            requiredString(keyword, "A palavra-chave"),
        );
    }

    async create(value: unknown): Promise<ProductRecord> {
        const product = Product.create(asInput(value));
        await this.ensureActiveCategory(product.getCategoryId());

        return this.repository.create(product.toPayload());
    }

    async update(id: unknown, value: unknown): Promise<ProductRecord> {
        const productId = uuid(id, "O identificador do produto");
        const input = asInput(value);

        if (Object.keys(input).length === 0) {
            throw new ValidationError("Informe ao menos um campo para atualizar.");
        }

        const current = await this.getById(productId);
        const product = Product.restore(current);
        product.update(input);

        if (input.category_id !== undefined) {
            await this.ensureActiveCategory(product.getCategoryId());
        }

        const updated = await this.repository.update(
            productId,
            product.toPayload(),
        );

        if (!updated) {
            throw new NotFoundError("Produto não encontrado.");
        }

        return updated;
    }

    async remove(id: unknown): Promise<void> {
        const productId = uuid(id, "O identificador do produto");
        await this.getById(productId);

        if (!(await this.repository.remove(productId))) {
            throw new NotFoundError("Produto não encontrado.");
        }
    }

    private async ensureActiveCategory(categoryId: string): Promise<void> {
        const category = await this.categoryRepository.findById(categoryId);

        if (!category) {
            throw new NotFoundError("Categoria do produto não encontrada.");
        }

        if (!category.active) {
            throw new ValidationError(
                "Não é permitido vincular um produto a uma categoria inativa.",
            );
        }
    }
}
