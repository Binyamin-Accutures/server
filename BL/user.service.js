import userDL from '../DL/user.controller'
import auth from '../auth'


const login = async (data) => {
    let user = getUser({email : data.email})
    if (!user){
        throw "no user found"
    }
    /* navigate to register?*/
    /* do the bycrypt */
    let token = await auth.createToken(data)
    return token
}

const register = async (data) => {
    let user = getUser({email : data.email})
    if (user){
        throw "user exists"
    }
    if (!data.email || !data.password){
        throw "missing data"
    }
    user = await userDL.create({data})
    let token = await auth.createToken(data)
    return token
}
const getUser = async (email) => {
    await userDL.findOne({email : email})
}

module.exports = { register, getUser, login}