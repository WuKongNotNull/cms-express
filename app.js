const express = require('express')
const userRouter = require('./router/user.js');
const {expressjwt: jwt} = require('express-jwt');
const cors = require('cors');
const app = express()
// 导入数据校验异常对象
const joi = require("joi");

// 跨域中间件
app.use(cors())

// 设置静态资源的中间件
app.use(express.static('public'))

// 注册中间件
app.use(express.urlencoded({extended: false }))

//自定义统一响应数据结构的中间件，需要放在 身份验证中间件之上 🙉
app.use((
    req,
    res,
    next
) => {
    res.sendResResult = (code=1,msg='success',data=null) => {
        return   res.send({
            code: code,
            msg: msg ,
            data:  data
        })
    }
    next()
})

// 中间件：身份验证，验证失败，直接进入全局错误中间件 ,排除登录和注册请求不需要进行身份验证
app.use(
    jwt({
        secret: "wukongnotnull.com",
        algorithms: ["HS256"],
    }).unless({ path: ["/api/admin/register","/api/admin/login"] })
);



// 注册路由到服务器中
app.use(userRouter)


//全局错误中间件,位置要放在所有路由的下面 🙉
app.use((err,req,res,next) => {
    if(err instanceof  joi.ValidationError) return res.sendResResult(0,'表单数据不合法，请重新输入')
    // token 不合法的时候如何处理
    if (err.name === 'UnauthorizedError') {
        return res.sendResResult(0,  'token 令牌不合法' )
    }

   res.sendResResult(0,'系统未知异常，请排查',{err: err})

})


app.listen(3000, () => {
    console.log(`服务器运行中，url 为 http://localhost:3000`)
})