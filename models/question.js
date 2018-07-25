const { Constants } = require('../utils')
module.export = class {
	constructor(rawQuestion){
		if (!Array.isArray(rawQuestion)) {
			throw new Error(`ArgumentError: Parameter 'rawQuestion' must be of type array.`)
		}
		this.type = Constants.QUESTION_TYPES.MULTIPLE_SELECTION
		this.question = ``
		this.options = []
		this.answers
		// const parsedQuestion = {
		// 	type:``,
		// 	question: ``,
		// 	options: ``
		// }
	}
}