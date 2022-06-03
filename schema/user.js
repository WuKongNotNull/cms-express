// 指定表单数据校验的规则
const joi = require('joi');

// 制订账号的验证规则
const username = joi.string().alphanum().
                    min(3).max(10).required();

// 制订密码的验证规则  abC123
const password = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

// 制订重复密码的规则  abA123
const repeatPassword = joi.ref('password')

// 制订昵称的规则
const nickname = joi.string().max(10)

// 制订邮箱的规则
const email = joi.string().pattern(new RegExp('^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$'))

// 制订id的规则
const id= joi.string()

exports.register_schema = {
    body: {
        username: username,
        password: password,
        re_password: repeatPassword
    }
}

exports.login_schema = {
    body: {
        username: username,
        password: password
    }
}

exports.modify_schema = {
    body: {
        id: id,
        nickname:nickname,
        email:email
    }
}

exports.admin_add_user_schema = {
    username: username,
    password:  password
}