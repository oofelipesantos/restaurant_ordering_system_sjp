import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: ["src/tests/**/*.test.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "json-summary"],
            include: ["src/**/*.ts"],
            exclude: [
                "src/config/**",
                "src/server.ts",
                "src/tests/**",
                "src/**/*.d.ts",
            ],
            thresholds: {
                lines: 60,
                statements: 60,
                functions: 60,
                branches: 60,
            },
        },
    },
});
