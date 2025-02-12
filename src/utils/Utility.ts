import type {
	RecipleClient,
	RecipleModuleData,
	RecipleModuleLoadData,
	RecipleModuleStartData,
} from "reciple";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "../database/Schema.js";
import {
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	type GuildTextBasedChannelTypes,
	inlineCode,
} from "discord.js";
import { LavalinkManager } from "lavalink-client";
import { env } from "@/Env.js";

export class Utility implements RecipleModuleData {
	public embedColor = "Blurple";
	public database!: ReturnType<typeof drizzle>;
	public client!: RecipleClient<true>;
	public lavalink!: LavalinkManager;

	public async onStart({ client }: RecipleModuleStartData): Promise<boolean> {
		this.client = client as RecipleClient<true>;

		const pool = new Pool({
			host: env.DB_HOST,
			port: env.DB_PORT,
			user: env.DB_USER,
			password: env.DB_PASS,
			database: env.DB_HOST,
		});

		this.database = drizzle(pool, { schema });

		this.lavalink = new LavalinkManager({
			nodes: [
				{
					authorization: "youshallnotpass",
					host: "doxbit.ru",
					port: 2333,
					secure: false,
					id: "testnode",
				},
			],
			sendToShard: (guildId, payload) => this.client.guilds.cache.get(guildId)?.shard?.send(payload),
			autoSkip: true,
			client: {
				id: env.APP_ID,
				username: "SlashMusic",
			},
		});

		this.client.on("raw", d => this.lavalink.sendRawData(d));

		return true;
	}

	public async onLoad(data: RecipleModuleLoadData): Promise<string | void> {
		this.client.rest.on("rateLimited", async (info) =>
			this.client.logger?.warn("Ratelimited!", info),
		);

		this.lavalink.init({
			id: this.client.user.id,
			username: this.client.user.username
		}).then(() => {
			this.lavalink.nodeManager.on("create", (node) => {
				this.client.logger?.info(`The Lavalink Node #${node.id} connected`);
			});
		})
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
