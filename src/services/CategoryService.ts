import { ConflictError, NotFoundError, ValidationError } from "../errors/AppError.js";
import { Category, type CategoryInput, type CategoryRecord } from "../model/Category.js";
import CategoryRepository, { type CategoryRepositoryContract } from "../repositories/CategoryRepository.js";
import { requiredString, uuid } from "../utils/validation.js";

function asInput(value: unknown): CategoryInput {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new ValidationError("Os dados da categoria são inválidos.");
    }

    return value as CategoryInput;
}

export class CategoryService {
    constructor(
        private readonly repository: CategoryRepositoryContract = CategoryRepository,
    ) {}

    async list(): Promise<CategoryRecord[]> {
        return this.repository.findAll();
    }

    async getById(id: unknown): Promise<CategoryRecord> {
        const category = await this.repository.findById(
            uuid(id, "O identificador da categoria"),
        );

        if (!category) {
            throw new NotFoundError("Categoria não encontrada.");
        }

        return category;
    }

    async search(keyword: unknown): Promise<CategoryRecord[]> {
        return this.repository.searchByKeyword(
            requiredString(keyword, "A palavra-chave"),
        );
    }

    async create(value: unknown): Promise<CategoryRecord> {
        const category = Category.create(asInput(value));
        await this.ensureUniqueName(category.getName());

        return this.repository.create(category.toPayload());
    }

    async update(id: unknown, value: unknown): Promise<CategoryRecord> {
        const categoryId = uuid(id, "O identificador da categoria");
        const input = asInput(value);

        if (Object.keys(input).length === 0) {
            throw new ValidationError("Informe ao menos um campo para atualizar.");
        }

        const current = await this.getById(categoryId);
        const category = Category.restore(current);
        category.update(input);
        await this.ensureUniqueName(category.getName(), categoryId);

        const updated = await this.repository.update(
            categoryId,
            category.toPayload(),
        );

        if (!updated) {
            throw new NotFoundError("Categoria não encontrada.");
        }

        return updated;
    }

    async remove(id: unknown): Promise<void> {
        const categoryId = uuid(id, "O identificador da categoria");
        await this.getById(categoryId);

        if (!(await this.repository.remove(categoryId))) {
            throw new NotFoundError("Categoria não encontrada.");
        }
    }

    private async ensureUniqueName(name: string, excludeId?: string): Promise<void> {
        const existing = await this.repository.findByName(name, excludeId);

        if (existing) {
            throw new ConflictError("Já existe uma categoria com esse nome.");
        }
    }
}
