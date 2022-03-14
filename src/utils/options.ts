const functions = {
  url: () => {
    return process.env.NODE_ENV === "development"
      ? `http://localhost:${functions.port()}/`
      : process.env.BASE_URL
  },
  port: () => process.env.PORT || 3000
}

export default functions
