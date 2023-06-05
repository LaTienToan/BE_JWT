import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import bluebird from 'bluebird';
import db from '../models/index'

// create the connection, specify bluebird as Promise


const salt = bcrypt.genSaltSync(10);
const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword

}

const createNewUser = async (username, email, password) => {
    let hashPass = hashUserPassword(password)
    try {
        await db.User.create({
            username: username,
            email: email,
            password: hashPass
        })
    } catch (error) {
        console.log("check err: ", error);
    }

}

const getUserList = async () => {
    //test relationships    
    let newUser = await db.User.findOne({
        where: { id: 1 },
        attributes: ['id', 'username', 'email'],
        include: { model: db.Group, attributes: ['name', 'description'] },
        raw: true,
        nest: true
    })
    // console.log(newUser);

    let newRoles = await db.Role.findAll({
        include: { model: db.Group, where: { id: 1 } },
        raw: true,
        nest: true
    })
    // console.log('>>>> check role: ', newRoles);


    let users = []
    users = await db.User.findAll()
    return users;
    // try {
    //     const [rows, fields] = await connection.execute('SELECT * from user');
    //     return rows;
    // } catch (error) {
    //     console.log(">>> check errr: ", error);
    // }
}

const deleteUser = async (userId) => {
    await db.User.destroy({
        where: { id: userId }
    })
    // const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird });
    // try {
    //     const [rows, fields] = await connection.execute('DELETE FROM user WHERE id=?', [id]);
    //     return rows;
    // } catch (error) {
    //     console.log(">>> check errr: ", error);
    // }
}

const getUserById = async (id) => {
    let user = {};
    user = await db.User.findOne({
        where: {
            id: id
        }
    })
    return user = user.get({ plain: true })
    // console.log(">>>>> check user: ", user, "check id: ", id);
    // const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird });
    // try {
    //     const [rows, fields] = await connection.execute('SELECT * FROM user WHERE id=?', [id]);
    //     return rows;
    // } catch (error) {
    //     console.log(">>> check errr: ", error);
    // }
}

const updateUserInfo = async (username, email, id) => {
    await db.User.update({ username: username, email: email }, {
        where: {
            id: id
        }
    });
    // const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird });
    // try {
    //     const [rows, fields] = await connection.execute('UPDATE user set username = ?, email = ? WHERE id=?', [username, email, id]);
    //     return rows;
    // } catch (error) {
    //     console.log(">>> check errr: ", error);
    // }
}

module.exports = {
    createNewUser,
    getUserList,
    deleteUser,
    getUserById,
    updateUserInfo
}