import fs from 'fs';
import https from 'https';
import path from 'path';

class HTTPSConfig {
  static loadCertificates() {
    const keyPath = process.env.HTTPS_KEY;
    const certPath = process.env.HTTPS_CERT;

    if (!keyPath || !certPath) {
      throw new Error('HTTPS_KEY and HTTPS_CERT are required for HTTPS in production');
    }

    const resolvedKey = path.resolve(keyPath);
    const resolvedCert = path.resolve(certPath);

    return {
      key: fs.readFileSync(resolvedKey),
      cert: fs.readFileSync(resolvedCert),
    };
  }

  static createServer(app) {
    if (process.env.NODE_ENV !== 'production') {
      return app;
    }

    const credentials = HTTPSConfig.loadCertificates();
    return https.createServer(credentials, app);
  }

  static redirectHTTPtoHTTPS() {
    return (req, res, next) => {
      if (process.env.NODE_ENV === 'production' && !req.secure) {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
      }
      next();
    };
  }
}

export default HTTPSConfig;
