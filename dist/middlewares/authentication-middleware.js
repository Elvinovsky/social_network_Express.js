"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = void 0;
exports.authenticationMiddleware = ((req, res, next) => {
    // -----------------------------------------------------------------------
    // authentication middleware
    const auth = { login: 'admin', password: 'qwerty' }; // change this
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    // Verify login and password are set and correct
    if (req.headers.authorization === 'Basic YWRtaW46cXdlcnR5' && login && password && login === auth.login && password === auth.password) {
        // Access granted...
        return next();
    }
    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
    res.status(401).send('Authentication required.'); // custom message
    // -----------------------------------------------------------------------
});
