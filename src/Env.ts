import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        TOKEN: z.string(),
        APP_ID: z.string(),
        DEV_USERS: z.string().array(),
        DEV_GUILDS: z.string().array(),
        DB_USER: z.string(),
        DB_PASS: z.string(),
        DB_HOST: z.string(),
        DB_PORT: z.coerce.number(),
        DB_NAME: z.string(),
    },

    /**
     * What object holds the environment variables at runtime. This is usually
     * `process.env` or `import.meta.env`.
     */

    runtimeEnvStrict: {
        TOKEN: process.env.TOKEN,
        DEV_USERS: process.env.DEV_USERS,
        DEV_GUILDS: process.env.DEV_GUILDS,
        APP_ID: process.env.APP_ID,
        DB_USER: process.env.DB_USER,
        DB_PASS: process.env.DB_PASS,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME
    },

    /**
     * By default, this library will feed the environment variables directly to
     * the Zod validator.
     *
     * This means that if you have an empty string for a value that is supposed
     * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
     * it as a type mismatch violation. Additionally, if you have an empty string
     * for a value that is supposed to be a string with a default value (e.g.
     * `DOMAIN=` in an ".env" file), the default value will never be applied.
     *
     * In order to solve these issues, we recommend that all new projects
     * explicitly specify this option as true.
     */
    emptyStringAsUndefined: true,
});