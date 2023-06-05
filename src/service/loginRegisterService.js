import bcrypt from 'bcryptjs';
import db from '../models/index'
import { Op } from 'sequelize';
import { getGroupWithRoles } from './JWTService'
import { createJWT } from '../middleware/JWTAtion'
require('dotenv').config()
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword

}

const checkEmailExits = async (userEmail) => {
    let user = await db.User.findOne({
        where: { email: userEmail }
    })

    if (user) {
        return true
    }

    return false
}

const checkPhoneEixts = async (userPhone) => {
    let user = await db.User.findOne({
        where: { phone: userPhone }
    })

    if (user) {
        return true
    }

    return false
}

const registerNewUser = async (rawUserData) => {
    try {

        //check email / phone are exits
        let isEmailExits = await checkEmailExits(rawUserData.email)
        console.log('check email: ', isEmailExits);
        if (isEmailExits === true) {
            return {
                EM: 'the email is already exits',
                EC: 1
            }
        }
        let isPhoneExits = await checkPhoneEixts(rawUserData.phone)
        if (isPhoneExits === true) {
            return {
                EM: 'the phone number is already exits',
                EC: 1
            }
        }
        //hash user password
        let hashPassword = hashUserPassword(rawUserData.password)
        //create new user
        await db.User.create({
            email: rawUserData.email,
            username: rawUserData.userName,
            password: hashPassword,
            phone: rawUserData.phone,
            groupId: 4

        })

        return {
            EM: 'A user is created successfully!',
            EC: 0
        }

    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }

}

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword); // true or fale

}

const handleUserLogin = async (rawData) => {
    console.log(rawData);
    try {
        let user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: rawData.valueLogin },
                    { phone: rawData.valueLogin }
                ]
            }
        })
        if (user) {
            let isCorrectPassword = checkPassword(rawData.password, user.password)
            if (isCorrectPassword === true) {

                // let token = 

                // test roles:
                let groupWithRoles = await getGroupWithRoles(user);
                let payload = {
                    email: user.email,
                    username: user.username,
                    groupWithRoles,

                }
                let token = createJWT(payload)
                return {
                    EM: 'OK',
                    EC: 0,
                    DT: {
                        access_token: token,
                        groupWithRoles,
                        email: user.email,
                        username: user.username
                    }
                }
            }
        }
        return {
            EM: 'Your email/phone number or is password is incorrect!',
            EC: 1,
            DT: ''
        }


    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: ''

        }
    }
}

module.exports = {
    registerNewUser,
    handleUserLogin,
    hashUserPassword,
    checkEmailExits,
    checkPhoneEixts
}