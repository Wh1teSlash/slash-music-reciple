import type {
	RecipleClient,
	RecipleModuleData,
	RecipleModuleLoadData,
	RecipleModuleStartData,
} from "reciple";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../database/schema.js";
import {
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	type GuildTextBasedChannelTypes,
	inlineCode,
} from "discord.js";

export class Utility implements RecipleModuleData {
	public embedColor = "Blurple";
	public database!: ReturnType<typeof drizzle>;
	public client!: RecipleClient<true>;

	public async onStart({ client }: RecipleModuleStartData): Promise<boolean> {
		this.client = client as RecipleClient<true>;

		const pool = new Pool({
			host: this.getEnvVariable("DB_HOST"),
			port: Number(this.getEnvVariable("DB_PORT")),
			user: this.getEnvVariable("DB_USER"),
			password: this.getEnvVariable("DB_PASS"),
			database: this.getEnvVariable("DB_NAME"),
		});

		this.database = drizzle(pool, { schema });

		return true;
	}

	public async onLoad(data: RecipleModuleLoadData): Promise<string | void> {
		this.client.rest.on("rateLimited", async (info) =>
			this.client.logger?.warn("Ratelimited!", info),
		);
	}

	public getGuildTextBasedChannelTypes(): GuildTextBasedChannelTypes[] {
		return [
			ChannelType.AnnouncementThread,
			ChannelType.GuildAnnouncement,
			ChannelType.GuildText,
			ChannelType.GuildVoice,
			ChannelType.PrivateThread,
			ChannelType.PublicThread,
		];
	}

	public createViewMessageButton(
		urlResolvable: string | { url: string },
		label?: string,
	): ButtonBuilder {
		return new ButtonBuilder()
			.setLabel(label ?? "Увидеть сообщение")
			.setStyle(ButtonStyle.Link)
			.setURL(
				typeof urlResolvable === "string" ? urlResolvable : urlResolvable.url,
			);
	}

	public getEnvVariable(key: string): string {
		const value = process.env[key];
		if (typeof value !== "string" || value.trim() === "") {
			throw new Error(`Environment variable ${key} is not set or is empty.`);
		}
		return value;
	}

	public createErrorMessage(message: string): string {
		return this.createLabel(message, "❌");
	}

	public createSuccessMessage(message: string): string {
		return this.createLabel(message, "✅");
	}

	public createWarningMessage(message: string): string {
		return this.createLabel(message, "⚠️");
	}

	public createLabel(message: string, emoji: string): string {
		return `${inlineCode(emoji)} ${message}`;
	}
}

export default new Utility();
