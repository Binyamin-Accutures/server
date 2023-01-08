

const errController = async(req,res)=>{
    try{
        if(!req.errCode) throw "missing error"
    }
    catch(e){
        res.status(500).send(e)
        return;
    }
    finally{
        res.status(req.errCode.code).send(req.errCode.message)
    }

}

module.exports = {
    errController
}