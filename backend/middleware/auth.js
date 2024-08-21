// jwt authentication middleware

import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send('No token, authorization denied');
  }
  console.log("token", token);
  console.log("JWT_SECRET", process.env.JWT_SECRET);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    console.log("decoded.user", decoded.user);
    console.log("token", token);
    console.log("JWT_SECRET", process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(400).send('Token is not valid');
  }
}

export default auth;