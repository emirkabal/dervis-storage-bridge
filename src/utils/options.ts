const port = process.env.PORT || 3000;
export default {
  url:
    process.env.NODE_ENV === "development"
      ? `http://localhost:${port}/`
      : process.env.BASE_URL,
  port
};
