const { errMessage } = require("./errController");

const ChechData = (data,parameters)=>{
parameters.forEach(v => {
        if(!data[v]) throw errMessage.MISSING_DATA
    });
} 

module.exports = {ChechData}


