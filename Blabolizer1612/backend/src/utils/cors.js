module.exports = function setCors(res) {
   // local cors headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    // remote cors headers
    // res.setHeader('Access-Control-Allow-Origin', 'https://blabolizer1612.vercel.app');
   
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};