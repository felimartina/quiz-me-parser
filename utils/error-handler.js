module.exports.handle = (error, action, exit = true) => {
	if (action) {
		console.error(`There was an error trying to perform action: ${action}.`)
	} else {
		console.error(`Unexpected error.`)
	}
	console.error(error.message)
	if (error.response && error.response.data) {
		console.error(`Response:`)
		console.error(JSON.stringify(error.response.data, null, 4))
	}
	if (exit === true) process.exit(1)
}