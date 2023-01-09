

const errController = async(req,res)=>{
    try{
        if(!req.errCode) throw {message:"missing error"}
    }
    catch(e){
        res.status(500).send(e.message)
        return;
    }
    res.status(req.errCode.code).send(req.errCode.message)
}

module.exports = {
    errController
}