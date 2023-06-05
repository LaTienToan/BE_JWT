import db from '../models/index'
import { checkEmailExits, checkPhoneEixts, hashUserPassword } from './loginRegisterService'

const getAllUser = async () => {

    try {
        let users = await db.User.findAll({
            attributes: ['id', 'username', 'email', 'phone', 'sex'],
            include: { model: db.Group, attributes: ['name', 'description'] },
        })
        if (users) {
            return {
                EM: 'get data success',//em error mesage
                EC: 0,//error code
                DT: users,//data
            }
        } else {
            return {
                EM: 'get data success',//em error mesage
                EC: 0,//error code
                DT: [],//data
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs with services',//em error mesage
            EC: 1,//error code
            DT: [],//data
        }
    }
}

const getUserWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        console.log('check offset: ', offset);
        const { count, rows } = await db.User.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ['id', 'username', 'email', 'phone', 'sex', 'address'],
            include: { model: db.Group, attributes: ['name', 'description', 'id'] },
            order: [
                ['id', 'DESC'],]
        })

        let totalPage = Math.ceil(count / limit)

        let data = {
            totalRows: count,
            totalPage: totalPage,
            users: rows

        }
        return {
            EM: 'fetch ok',//em error mesage
            EC: 0,//error code
            DT: data,//data
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs with services',//em error mesage
            EC: 1,//error code
            DT: [],//data
        }
    }
}

const createNewUser = async (data) => {
    try {
        //check email / phone are exits
        let isEmailExits = await checkEmailExits(data.email)
        console.log('check email: ', isEmailExits);
        if (isEmailExits === true) {
            return {
                EM: 'the email is already exits',
                EC: 1,
                DT: 'email'
            }
        }
        let isPhoneExits = await checkPhoneEixts(data.phone)
        if (isPhoneExits === true) {
            return {
                EM: 'the phone number is already exits',
                EC: 1,
                DT: 'phone'
            }
        }
        //hash user password
        let hashPassword = hashUserPassword(data.password)

        await db.User.create({ ...data, password: hashPassword })
        return {
            EM: 'create ok',//em error mesage
            EC: 0,//error code
            DT: [],//data
        }
    } catch (error) {

    }
}

const updateUser = async (data) => {
    try {
        let users = await db.User.findOne({
            where: { id: data.id }
        })
        if (users) {
            //update
            if (!data.groupId) {
                return {
                    EM: 'Error with empty groupId',//em error mesage
                    EC: 1,//error code
                    DT: 'group',//data
                }
            }
            await users.update({
                username: data.username,
                address: data.address,
                sex: data.sex,
                groupId: data.groupId
            })
            return {
                EM: 'Update user success',//em error mesage
                EC: 0,//error code
                DT: '',//data
            }
        } else {
            //not found
            return {
                EM: 'User not found',//em error mesage
                EC: 2,//error code
                DT: '',//data
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'something wrongs with services',
            EC: 1,
            DT: []
        }
    }
}

const deleteUser = async (id) => {
    try {
        let user = await db.User.findOne({
            where: { id: id }
        })
        if (user) {
            await user.destroy();
            return {
                EM: 'delete user success',//em error mesage
                EC: 0,//error code
                DT: [],//data
            }
        } else {
            return {
                EM: 'user not exist',//em error mesage
                EC: 2,//error code
                DT: [],//data
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from service',//em error mesage
            EC: 1,//error code
            DT: [],//data
        }
    }
}



module.exports = {
    getAllUser,
    createNewUser,
    updateUser,
    deleteUser,
    getUserWithPagination
}