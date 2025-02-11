import type { GuildMember } from "discord.js";
import type { RecipleModuleData, RecipleModuleLoadData } from "reciple";

export class WelcomeEvent implements RecipleModuleData {
	constructor() {
		this.handleWelcomeEvent = this.handleWelcomeEvent.bind(this);
	}

	/**
	 * Executed when module is started (Bot is not logged in).
	 */
	async onStart(): Promise<boolean> {
		return true;
	}

	/**
	 * Executes when the module is loaded (Bot is logged in).
	 */
	async onLoad({ client }: RecipleModuleLoadData): Promise<void> {
		client.on("guildMemberAdd", this.handleWelcomeEvent);
	}

	/**
	 * Executes when the module is unloaded (Bot is pre log out).
	 */
	async onUnload({ client }: RecipleModuleLoadData): Promise<void> {
		client.removeListener("guildMemberAdd", this.handleWelcomeEvent);
	}

	/**
	 * Called when a user joins the server.
	 */
	async handleWelcomeEvent(member: GuildMember): Promise<void> {
		await member
			.send(`Welcome to **${member.guild.name}** server!`)
			.catch(() => null);
	}
}

export default new WelcomeEvent();
