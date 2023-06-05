import userApiService from '../service/userApiService'

const readFunc = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page
            let limit = req.query.limit
            // console.log("check data: ", "page: ", page, " limit: ", limit)

            let data = await userApiService.getUserWithPagination(+page, +limit);
            return res.status(200).json({
                EM: data.EM,//em error mesage
                EC: data.EC,//error code
                DT: data,//data
            })
        } else {
            let data = await userApiService.getAllUser();
            return res.status(200).json({
                EM: data.EM,//em error mesage
                EC: data.EC,//error code
                DT: data,//data
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',//em error mesage
            EC: '-1',//error code
            DT: '',//data
        })
    }
}

const createFunc = async (req, res) => {
    try {
        let data = await userApiService.createNewUser(req.body);
        console.log("check data backend:", data);
        return res.status(200).json({
            EM: data.EM,//em error mesage
            EC: data.EC,//error code
            DT: data,//data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',//em error mesage
            EC: '-1',//error code
            DT: '',//data
        })
    }
}

const updateFunc = async (req, res) => {
    try {
        let data = await userApiService.updateUser(req.body);
        console.log("check data backend:", data);
        return res.status(200).json({
            EM: data.EM,//em error mesage
            EC: data.EC,//error code
            DT: data,//data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',//em error mesage
            EC: '-1',//error code
            DT: '',//data
        })
    }
}

const deleteFunc = async (req, res) => {
    try {
        // console.log("req.body = ", req.body);
        let data = await userApiService.deleteUser(req.body.id)
        return res.status(200).json({
            EM: data.EM,//em error mesage
            EC: data.EC,//error code
            DT: data,//data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',//em error mesage
            EC: '-1',//error code
            DT: '',//data
        })
    }
}

const getUserAccount = async (req, res) => {
    return res.status(200).json({
        EM: 'ok',//em error mesage
        EC: 0,//error code
        DT: {
            access_token: req.token,
            groupWithRoles: req.user.groupWithRoles,
            email: req.user.email,
            username: req.user.username
        }
    })
}

module.exports = {
    readFunc,
    createFunc,
    updateFunc,
    deleteFunc,
    getUserAccount
}