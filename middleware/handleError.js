module.exports = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === 'CastError') {
    response.status(400).send({
      error: 'Error used is malformed'
    })
  } else {
    response.status(500).end()
  }
}
