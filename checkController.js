const { errMessage } = require("./errController");
///////////////////////////////////////////////////////////////
const checkData = (data,parameters)=>{
parameters.forEach(v => {
        if(!data[v]) throw errMessage.MISSING_DATA
    });
} 

module.exports = {checkData}


