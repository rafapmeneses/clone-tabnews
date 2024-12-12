function status(request, response) {
  response.status(200).json({ valor: "Test" });
}

export default status;
