#!/usr/bin/env node

const program = require('commander')
const Commands = require('./commands')
const { version } = require('./package.json')

program.version(version, '-v, --version')
program
	.command(`parse <fileName>`)
	.description(`Parses the given file with Q&As into JSON.`)
	.option(`-o --output [output]`, `Output file. Will be a JSON file with the parsed Q&As.`)
	.option(`-t --tags [tags]`,`Comma delimited tags for question to parse. ie. iam,exam,devops`)
	.action((fileName, options) => {
		Commands.ParseJson(fileName, options)
	})
program
	.command(`parse-folder <folder>`)
	.description(`Parses all Q&As .txt files in the given folder into JSON.`)
	.option(`-o --output [output]`, `Output file. Will be a JSON file with the parsed Q&As.`)
	.option(`-t --tags [tags]`,`Comma delimited tags for question to parse. ie. iam,exam,devops`)
	.action((folder, options) => {
		Commands.ParseFolder(folder, options)
	})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}