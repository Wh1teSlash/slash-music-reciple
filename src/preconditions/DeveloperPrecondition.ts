import type {
	CommandPreconditionData,
	ContextMenuCommandExecuteData,
	MessageCommandExecuteData,
	SlashCommandExecuteData,
} from "reciple";

const devUserIds: string[] =
	process.env.DEVELOPER_IDS?.split(",").map((id) => id.trim()) ?? [];

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
