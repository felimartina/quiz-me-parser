
module.exports = class {
	constructor() {
		this.isOpen = false
	}
	open() {
		console.log(`Starting to log to console...`)
	}

	close() {
		console.log(`Finished logging to console.`)
	}
	write(content) {
		console.log(content)
	}
}