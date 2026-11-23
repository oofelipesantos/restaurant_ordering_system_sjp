import { ValidationError } from "../errors/AppError.js";

const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function requiredString(value: unknown, field: string): string {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new ValidationError(`${field} é obrigatório.`);
    }

    return value.trim();
}

export function optionalString(
    value: unknown,
    field: string,
): string | null {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    if (typeof value !== "string") {
        throw new ValidationError(`${field} deve ser um texto.`);
    }

    return value.trim() || null;
}

export function uuid(value: unknown, field: string): string {
    const normalized = requiredString(value, field);

    if (!UUID_PATTERN.test(normalized)) {
        throw new ValidationError(`${field} deve ser um UUID válido.`);
    }

    return normalized;
}

export function nonNegativeNumber(value: unknown, field: string): number {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
        throw new ValidationError(
            `${field} deve ser um número maior ou igual a zero.`,
        );
    }

    return value;
}

export function nonNegativeInteger(value: unknown, field: string): number {
    if (!Number.isInteger(value) || (value as number) < 0) {
        throw new ValidationError(
            `${field} deve ser um número inteiro maior ou igual a zero.`,
        );
    }

    return value as number;
}

export function positiveInteger(value: unknown, field: string): number {
    if (!Number.isInteger(value) || (value as number) <= 0) {
        throw new ValidationError(`${field} deve ser um número inteiro positivo.`);
    }

    return value as number;
}

export function booleanValue(value: unknown, field: string): boolean {
    if (typeof value !== "boolean") {
        throw new ValidationError(`${field} deve ser verdadeiro ou falso.`);
    }

    return value;
}
