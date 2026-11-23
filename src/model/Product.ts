import {
    booleanValue,
    nonNegativeNumber,
    optionalString,
    requiredString,
    uuid,
} from "../utils/validation.js";

export interface ProductRecord {
    id: string;
    category_id: string;
    title: string;
    description: string | null;
    price: number;
    image: string | null;
    available: boolean;
    active: boolean;
}

export interface ProductPayload {
    category_id: string;
    title: string;
    description: string | null;
    price: number;
    image: string | null;
    available: boolean;
    active: boolean;
}

export interface ProductInput {
    category_id?: unknown;
    title?: unknown;
    description?: unknown;
    price?: unknown;
    image?: unknown;
    available?: unknown;
    active?: unknown;
}

export class Product {
    private constructor(
        private readonly id: string | undefined,
        private categoryId: string,
        private title: string,
        private description: string | null,
        private price: number,
        private image: string | null,
        private available: boolean,
        private active: boolean,
    ) {}

    static create(input: ProductInput): Product {
        return new Product(
            undefined,
            uuid(input.category_id, "O identificador da categoria"),
            requiredString(input.title, "O título do produto"),
            optionalString(input.description, "A descrição do produto"),
            nonNegativeNumber(input.price, "O preço do produto"),
            optionalString(input.image, "A imagem do produto"),
            input.available === undefined
                ? true
                : booleanValue(input.available, "A disponibilidade do produto"),
            input.active === undefined
                ? true
                : booleanValue(input.active, "O status do produto"),
        );
    }

    static restore(record: ProductRecord): Product {
        return new Product(
            record.id,
            record.category_id,
            record.title,
            record.description,
            Number(record.price),
            record.image,
            record.available,
            record.active,
        );
    }

    update(input: ProductInput): void {
        if (input.category_id !== undefined) {
            this.categoryId = uuid(
                input.category_id,
                "O identificador da categoria",
            );
        }
        if (input.title !== undefined) {
            this.title = requiredString(input.title, "O título do produto");
        }
        if (input.description !== undefined) {
            this.description = optionalString(
                input.description,
                "A descrição do produto",
            );
        }
        if (input.price !== undefined) {
            this.price = nonNegativeNumber(input.price, "O preço do produto");
        }
        if (input.image !== undefined) {
            this.image = optionalString(input.image, "A imagem do produto");
        }
        if (input.available !== undefined) {
            this.available = booleanValue(
                input.available,
                "A disponibilidade do produto",
            );
        }
        if (input.active !== undefined) {
            this.active = booleanValue(input.active, "O status do produto");
        }
    }

    getCategoryId(): string {
        return this.categoryId;
    }

    isAvailable(): boolean {
        return this.available;
    }

    isActive(): boolean {
        return this.active;
    }

    toPayload(): ProductPayload {
        return {
            category_id: this.categoryId,
            title: this.title,
            description: this.description,
            price: this.price,
            image: this.image,
            available: this.available,
            active: this.active,
        };
    }

    toJSON(): ProductPayload & { id?: string } {
        const payload = this.toPayload();
        return this.id === undefined ? payload : { id: this.id, ...payload };
    }
}
