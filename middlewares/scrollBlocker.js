function scrollBlocker(req, res, next) {
  res.locals.scrollBlock = true;
  console.log("ScrollBlocker middleware executed.");
  next();
}

module.exports = scrollBlocker;
