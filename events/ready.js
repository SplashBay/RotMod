const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

function getAllCommandFiles(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	const files = entries.flatMap(entry => {
		const fullPath = path.join(dir, entry.name);
		return entry.isDirectory() ? getAllCommandFiles(fullPath) : [fullPath];
	});

	return files.filter(file => file.endsWith('.js'));
}

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.on('interactionCreate', interaction => {
	if (interaction.isChatInputCommand()) {
		console.log(`Received interaction: ${interaction.commandName}`);
	}
});


		const commandsPath = path.join(__dirname, '../commands');
		const commandFiles = getAllCommandFiles(commandsPath);

		let count = 0;

		for (const file of commandFiles) {
			const command = require(file);
			if (command.data && typeof command.data.toJSON === 'function') {
				count++;
			} else {
				console.warn(`[WARN] Skipped invalid command: ${file}`);
			}
		}

		console.log(`Successfully found ${count} slash command(s) in the filesystem.`);
	},
};
