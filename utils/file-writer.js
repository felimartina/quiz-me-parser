
const fs = require('fs')
module.exports = class {
	constructor(fileName) {
		this.fileName = fileName
		this.stream
		this.isOpen = false
	}
	open() {
		this.stream = fs.createWriteStream(this.fileName)
		this.isOpen = true
	}

	close() {
		this.stream.end()
		this.isOpen = false
	}
	write(content) {
		this.stream.write(content)
	}
}