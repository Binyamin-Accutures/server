

const errController = (err)=>{
    try{
        if(!req.errCode) throw {message:"missing error"}
    }
    catch(e){
        res.status(500).send(e.message)
        return;
    }
    res.status(req.errCode.code).send(req.errCode.message)
}
const errMessage = Object.freeze({
    MISSING_DATA: {code: 400,message: "missing data"},
    USER_NOT_FOUND: {code: 400,message: "user not found"},
    USER_ALREADY_REGISTERED: {code: 400,message: "user already registered"},
    USER_NOT_REGISTERED: {code: 400,message: "user not registered"},
    SUCCESS:{code: 200,message: "success"},
    UNAUTHORIZED:{code: 401,message: "you need to login first"},
    WORNG_PASSWORD:{code: 400,message: "password is not correct"},

})

module.exports = {
    errController,
    errCreate
}