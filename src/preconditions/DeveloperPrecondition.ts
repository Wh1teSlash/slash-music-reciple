import { env } from "@/Env.js";
import type {
	CommandPreconditionData,
	ContextMenuCommandExecuteData,
	MessageCommandExecuteData,
	SlashCommandExecuteData,
} from "reciple";

const devUserIds: string[] =
	env.DEV_USERS.map((id) => id.trim()) ?? [];

export class DeveloperPrecondition implements CommandPreconditionData {
	id = "my.reciple.js.developerprecondition";
	disabled = false;

	contextMenuCommandExecute(execute: ContextMenuCommandExecuteData) {
		return devUserIds.includes(execute.interaction.user.id);
	}

	messageCommandExecute(execute: MessageCommandExecuteData) {
		return devUserIds.includes(execute.message.author.id);
	}

	slashCommandExecute(execute: SlashCommandExecuteData) {
		return devUserIds.includes(execute.interaction.user.id);
	}
}

export default DeveloperPrecondition;
