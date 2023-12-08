const cors = require('cors')

const WhiteList = [ "http://localhost:3000", "http://localhost:8000", "https://server-domain.com/socket.io" ]
const corsWithDelegate = (req, cb) => {
  var corsOption;
  if (WhiteList.indexOf(req.header("Origin")) !== -1) {
    corsOption = { origin: true, credentials: true}
  } else {
    corsOption = { origin: false }
  }
  cb(null, corsOption)
}

exports.cors = cors({
    origin: true,
    credentials: true
  });
exports.corsWithOption = cors(corsWithDelegate);
