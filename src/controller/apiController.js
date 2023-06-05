import loginRegisterService from '../service/loginRegisterService'
const testApi = (req, res) => {
    return res.status(200).json({
        message: 'ok',
        data: 'test api'
    })
}

const handleRegister = async (req, res) => {
    try {
        //req.body :email, phone, userName, password
        if (!req.body.email || !req.body.phone || !req.body.password) {
            return res.status(200).json({
                EM: 'missing require parameters',//em error mesage
                EC: '1',//error code
                DT: '',//data
            })
        }

        if (req.body.password && req.body.password.length < 4) {
            return res.status(200).json({
                EM: 'Your password must have more than 3 letters',//em error mesage
                EC: '1',//error code
                DT: '',//data
            })
        }

        //servive: create user
        let data = await loginRegisterService.registerNewUser(req.body)


        return res.status(200).json({
            EM: data.EM,//em error mesage
            EC: data.EC,//error code
            DT: '',//data
        })


    } catch (error) {
        return res.status(500).json({
            EM: 'error from server',//em error mesage
            EC: '-1',//error code
            DT: '',//data
        })
    }
}

const handleLogin = async (req, res) => {
    try {
        let data = await loginRegisterService.handleUserLogin(req.body)
        //set cookie
        if (data && data.DT.access_token) {
            res.cookie("jwt", data.DT.access_token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
        }
        return res.status(200).json({
            EM: data.EM,//em error mesage
            EC: data.EC,//error code
            DT: data.DT,//data
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

module.exports = {
    testApi,
    handleRegister,
    handleLogin
}