

const TestOrigins = (req, res, next) => {
    console.log("req Header: ", req.headers);
    console.log("req Origins", req.headers.origin);
    next();
}

export default TestOrigins;