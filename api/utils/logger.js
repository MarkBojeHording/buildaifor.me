// Logger utility for law firm chatbot
function info(msg) {
  console.log(`[INFO] [${new Date().toISOString()}] ${msg}`);
}
function warn(msg) {
  console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`);
}
function error(msg) {
  console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`);
}

module.exports = { info, warn, error };
