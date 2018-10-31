const fs = require('fs')
const path = require('path')
const parseJsonFile = require('./json-parser')
const { ErrorHandler } = require('../utils')
module.exports = (folder, options) => {
	try {
		if (!fs.lstatSync(folder).isDirectory()){
			throw new Error(`Provided path is not a directory: ${folder}`)
		}
		const output = options.output || './'
		// Parse all .txt files in folder
		fs.readdirSync(folder).forEach(file => {
			if (file.indexOf('.txt') > 0){
				parseJsonFile(path.join(folder, file), {output: path.join(output, file).replace('.txt','.json'), tags: options.tags})
			}
		})
	} catch (error) {
		ErrorHandler.handle(error, `Parsing folder '${folder}'`)
	}
}