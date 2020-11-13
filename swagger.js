
 const swagoptions = {
  definition: {
    
    openapi: "3.0.0",
    info: { 
    "title" : "Express Dataset Documentation",
    "license": {
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
      },
      "version": "1.0.0",
      "contact": {
        "name": "DevMuhammad",
        "url": "https://lgithub.com/devmuhammad",
        "email": "shuaibola12@gmail.com"
      },
    },
    "servers": [
      {
        "url": "http://localhost:8000/"
      }
    ],
  },
  "apis": ["./routes/*.js"]

}

module.exports = swagoptions