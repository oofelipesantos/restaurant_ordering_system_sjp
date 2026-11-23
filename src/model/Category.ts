import {
    booleanValue,
    nonNegativeInteger,
    optionalString,
    requiredString,
} from "../utils/validation.js";

export interface CategoryRecord {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    display_order: number;
    active: boolean;
}

export interface CategoryPayload {
    name: string;
    description: string | null;
    icon: string | null;
    display_order: number;
    active: boolean;
}

export interface CategoryInput {
    name?: unknown;
    description?: unknown;
    icon?: unknown;
    display_order?: unknown;
    active?: unknown;
}

export class Category {
    private constructor(
        private readonly id: string | undefined,
        private name: string,
        private description: string | null,
        private icon: string | null,
        private displayOrder: number,
        private active: boolean,
    ) {}

    static create(input: CategoryInput): Category {
        return new Category(
            undefined,
            requiredString(input.name, "O nome da categoria"),
            optionalString(input.description, "A descrição da categoria"),
            optionalString(input.icon, "O ícone da categoria"),
            nonNegativeInteger(
                input.display_order,
                "A ordem de exibição da categoria",
            ),
            input.active === undefined
                ? true
                : booleanValue(input.active, "O status da categoria"),
        );
    }

    static restore(record: CategoryRecord): Category {
        return new Category(
            record.id,
            record.name,
            record.description,
            record.icon,
            record.display_order,
            record.active,
        );
    }

    update(input: CategoryInput): void {
        if (input.name !== undefined) {
            this.name = requiredString(input.name, "O nome da categoria");
        }
        if (input.description !== undefined) {
            this.description = optionalString(
                input.description,
                "A descrição da categoria",
            );
        }
        if (input.icon !== undefined) {
            this.icon = optionalString(input.icon, "O ícone da categoria");
        }
        if (input.display_order !== undefined) {
            this.displayOrder = nonNegativeInteger(
                input.display_order,
                "A ordem de exibição da categoria",
            );
        }
        if (input.active !== undefined) {
            this.active = booleanValue(input.active, "O status da categoria");
        }
    }

    getId(): string | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    isActive(): boolean {
        return this.active;
    }

    toPayload(): CategoryPayload {
        return {
            name: this.name,
            description: this.description,
            icon: this.icon,
            display_order: this.displayOrder,
            active: this.active,
        };
    }

    toJSON(): CategoryPayload & { id?: string } {
        const payload = this.toPayload();
        return this.id === undefined ? payload : { id: this.id, ...payload };
    }
}
