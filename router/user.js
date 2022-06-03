const express = require('express');
const userHandler = require('../router_handler/user.js')
const router = express.Router();
// 导入验证规则
const {register_schema, login_schema, modify_schema, admin_add_user_schema} = require("../schema/user");
// 验证是否符合规则
const expressJoi = require("@escook/express-joi");
const multer = require("multer");

// 注册新用户
router.post('/api/admin/register',expressJoi(register_schema),userHandler.registerUser)

// 登录用户
router.get('/api/admin/login',expressJoi(login_schema) ,userHandler.loginUser)

// 根据ID查询用户信息
router.get('/api/admin/users/id',userHandler.getUserById)

// 查询用户列表
router.get('/api/admin/users',userHandler.getUserList)

// 根据 id 修改用户信息的昵称和邮箱
router.patch('/api/admin/users',expressJoi(modify_schema),userHandler.modifyUser)

// 根据 id 删除用户信息
router.delete('/api/admin/users/:id',userHandler.delUser)

// 管理员操作添加用户
router.post('/api/admin/users',expressJoi(admin_add_user_schema),userHandler.addUser)

// 修改密码
router.patch('/api/admin/password',userHandler.modifyPassword)

// 设置图片存储路径
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads'); // ./ 表示当前项目根目录
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

// 添加配置文件到 multer 对象
const upload = multer({ storage: storage });
const imgBaseUrl = '../'


// 更换头像
router.patch('/api/admin/avatar',upload.array('avatar',2),userHandler.modifyAvatar)

// 查询头像
router.get('/api/admin/avatar',userHandler.getAvatar)

module.exports = router
