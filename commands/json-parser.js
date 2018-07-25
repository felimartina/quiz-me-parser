const fs = require('fs')
const uuidv4 = require('uuid/v4')
const ora = require('ora')
const { Constants, ErrorHandler, FileWriter, ConsoleWriter } = require('../utils')

const OPTION_DELIMITER = '-'
const CORRECT_ANSWER_MARK = '*'
const TAG_DELIMITER = '#'
const TAG_SEPARATOR = '|'
const WARNING_DELIMITER = '!'
module.exports = (fileName, options) => {
	const spinner = ora().start()
	const writer = options.output ? new FileWriter(options.output) : new ConsoleWriter()
	try {
		if (!fs.existsSync(fileName)) {
			throw new Error(`File '${fileName}' does not exist.`)
		}

		console.log(`Parsing started...`)
		const globalTags = options.tags ? options.tags.split(',') : []
		writer.open()
		const parsedQuestions = parseQuestions(fileName).map(q => {
			// Ensure that tags are unique and are not repeated
			q.tags = Array.from(new Set([...q.tags, ...globalTags]))
			return q
		})

		writer.write(JSON.stringify(parsedQuestions,null, 2))
		console.log(`Parsing finished...`)
	} catch (error) {
		ErrorHandler.handle(error, `Parsing file '${fileName}'`)
	} finally {
		if (writer.isOpen) writer.close()
		spinner.stop()
	}
}

function parseQuestions(fileName) {
	// Create a stream to read the file line by line
	const content = fs.readFileSync(fileName, 'utf8').split('\n')

	let currentQuestionBuffer = []
	const questions = []
	for (line of content) {
		if (line.trim() === '') {
			// If we hit an empty line we consider this is the end of a Q&A.
			questions.push(parseQuestion(currentQuestionBuffer))
			// clean up for next question
			currentQuestionBuffer = []
		} else {
			// We have content, buffer the text
			currentQuestionBuffer.push(line)
		}
	}
	return questions
}

function parseQuestion(rawQuestion) {
	if (!Array.isArray(rawQuestion)) {
		throw new Error(`ArgumentError: Parameter 'rawQuestion' must be of type array.`)
	}
	const question = []
	const options = []
	const answerIds = []
	let tags = []
	let warnings = []
	let isOutdated = false
	for (line of rawQuestion) {
		line = line.trim()
		if (line.startsWith(OPTION_DELIMITER)) {
			// if starts with OPTION_DELIMITER then it is an option
			const option = parseOption(line)
			options.push(option)
			if (option.isCorrectAnswer) answerIds.push(option.id)
		} else if (line.startsWith(TAG_DELIMITER)) {
			// if starts with TAG_DELIMITER then it is a tag line
			tags = [...tags, ...line.toLowerCase().replace('#', '').split(TAG_SEPARATOR)]
		} else if (line.startsWith(WARNING_DELIMITER)) {
			const warn = line.replace('!', '')
			if (warn.toLowerCase() === 'outdated' || warn.toLowerCase() === 'old') {
				// Add #outdated tag
				tags.push('outdated')
				// Add warning
				warnings.push(`This question was marked as OUTDATED!!!`)
				// Mark as outdated
				isOutdated = true
			}
		} else {
			// Part of the question
			question.push(line)
		}
	}
	return {
		question: question.join('\n'),
		options: options,
		answers: answerIds,
		type: answerIds.length > 1 ? Constants.QUESTION_TYPES.MULTIPLE_SELECTION : Constants.QUESTION_TYPES.SINGLE_CHOICE,
		tags: tags,
		warnings: warnings,
		isOutdated: isOutdated
	}
}

function parseOption(rawOption) {
	// an answer will be composed of the answer itself and it can also have an explanation at the end with `option (explanation...)`
	const explanationStartIndex = rawOption.lastIndexOf('(')
	let description = rawOption
	let explanation = ''
	if (explanationStartIndex >= 0) {
		description = description.substring(0, explanationStartIndex)
		explanation = rawOption.substring(explanationStartIndex + 1, rawOption.length - 1).trim()
	}
	description = description.replace(OPTION_DELIMITER, '').replace(CORRECT_ANSWER_MARK, '').trim()

	return {
		id: uuidv4(),
		description: description,
		explanation: explanation,
		isCorrectAnswer: rawOption.startsWith(`${OPTION_DELIMITER}${CORRECT_ANSWER_MARK}`) || rawOption.startsWith(`${CORRECT_ANSWER_MARK}${OPTION_DELIMITER}`)
	}
}