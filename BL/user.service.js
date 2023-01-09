import userDL from '../DL/user.controller'
import auth from '../auth'


const login = async (data) => {
    let user = await getUser({email : data.email})
    if (!user){
        throw {code: 400, message : "no user found"}
    }
    /* navigate to register?*/
    /* do the bycrypt */
    let token = await auth.createToken(data.email)
    return token
}

const register = async (data) => {
    let user = await getUser({email : data.email})
    if (user){
        throw {code : 400, message : "user exists"}
    }
    if (!data.email || !data.password){
        throw {code : 400, message : "missing data"}
    }
    user = await userDL.create({data})
    let token = await auth.createToken(data.email)
    return token
}

const getUser = async (email) => {
    await userDL.findOne({email : email})
}

module.exports = { register, getUser, login}