const connection = require('../db/index');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const multer = require('multer');


// 更换头像
exports.modifyAvatar = (req,res) => {
   // console.log('上传的文件为：  ',req.files);
    const files = req.files;
    // 图片的相对路径,保存到数据库中
    const path = '/uploads/'+files[0].filename;
    // 当前登录用户的id
    const id = req.auth.id;
    connection.query(
        'update cms_user set avatar = ? where id =?',
        [path,id],
        (err,results) => {
            if(err) return res.sendResResult(0,'数据库err')
            if(results.affectedRows ===0 ) return  res.sendResResult(0,'修改头像失败')
            res.sendResResult(1,'success',{
                url:  'http://'+req.headers.host+path
            })
        }
    )

}

// 查询个人头像
exports.getAvatar = (req,res) => {
    console.log(req.headers.host);
    // 获得 当前登录用户的id
    const id = req.auth.id;
    connection.query(
        'select * from cms_user where id = ? ',
        id,
        (err,results) => {
            if(err) return res.sendResResult(0,'数据库 err')
            if(results.length ===0) return  res.sendResResult(0,'头像不存在')
            res.sendResResult(1,'success',{
                url: 'http://'+req.headers.host+ results[0].avatar
            })
        }

    )

}

// 密码加密，将密码明文 加密成 密文
function encryptPassword(password) {
    return  bcrypt.hashSync(password,1);

}

// 用户注册
exports.registerUser = (req,res) => {
    const regUser = req.body

    // 保证账号的唯一性，若是唯一进行注册，否则不能注册
    const sql = 'select  * from cms_user where username = ?'
    connection.query(sql,[regUser.username],
        (err,results) => {
            if(err) return  res.sendResResult(0,'数据库 err 异常')

            //  账号重复
            if(results !== null && results.length !== 0 ){
                // 账号重复，不能注册
               return  res.sendResResult(0,'账号重复，不能注册')
            }

            // 账号唯一，对密码进行加密处理
            const encrypted_password = encryptPassword(regUser.password)

            // 账号是唯一,可以进行注册到数据库中
            const sql = 'insert into cms_user(username,password,created_date) value (?,?,?)'
            connection.query(sql,
                [regUser.username,encrypted_password,new Date()],
                (err,results)=>{
                    if(err) return  res.sendResResult(0,'数据库 err 异常')
                    if(results.affectedRows !== 1 ) return res.sendResResult(0,'数据插入用户失败，注册失败')
                   // console.log('results 对象为：',results);
                    // 修改创建人和创建时间
                    connection.query(
                        'update cms_user set created_by=? where id =?',
                         [results.insertId,results.insertId],
                        (err,results) => {
                            if(err) return  res.sendResResult(0,'数据库 err 异常')
                            if(results.affectedRows !== 1 ) return res.sendResResult(0,'数据插入用户过程中，添加创建人失败')
                            res.sendResResult();
                        }
                        )


                })


        })

}

// 用户登录
exports.loginUser = (req,res) => {

    const user = req.body;
    // 判断用户名是否存在
    const sql = 'select * from cms_user where username = ?'
    connection.query(sql,
        [user.username],
        (err,results) => {
           // console.log(results);
            if (err) return res.sendResResult(0, '数据库 err 异常')
            if (results ===null || results.length === 0) return res.sendResResult(0, '用户名不存在，登录失败')
            // 用户名存在，判断密码是否一致
             const flag = bcrypt.compareSync(user.password,results[0].password);
            if(!flag){ //flag = false  密码有可能不一致
                if(user.password === results[0].password ){ // 密码一致
                    //对于管理员创建的新用户： 密码一致，登录成功
                  return   res.sendResResult(1,'success',{
                        infoNo: 1,
                        info: '您使用的是初始密码，请立即修改',
                        token: 'Bearer '+jsonwebtoken.sign(
                            {
                                id: results[0].id,
                                username:results[0].username
                            },
                            'wukongnotnull.com',
                            {expiresIn: '10h'}
                        )
                    })
                }
              return   res.sendResResult(0,'，密码不正确，登录失败')
            }
            // 密码一致，登录成功
            res.sendResResult(1,'success',{
                token: 'Bearer '+jsonwebtoken.sign(
                    {
                        username:results[0].username,
                        id: results[0].id
                    },
                    'wukongnotnull.com',
                    {expiresIn: '10h'}
                )
            })

        })
}

// 根据 ID 查询用户信息
exports.getUserById = (req,res) => {
    console.log('token  是',req.headers.authorization);
    const sql = 'select id,username,nickname,email,avatar,created_by,created_date,modify_by,modify_date ' +
        'from cms_user where id = ?'
    connection.query(
        sql,
        req.query.id,
        (err,results)=>{
            if(err) return res.sendResResult(0,'数据库 err 异常')
            if(results === null || results.length === 0) return res.sendResResult(0,'数据库无记录')
            res.sendResResult(1,'success',results[0])
    })
}

// 查询用户列表
exports.getUserList = (req,res) => {
    const sql = 'select id,username,nickname,email,avatar,created_by,created_date,modify_by,modify_date ' +
        'from cms_user'
    connection.query(sql,(err,results) => {
        if(err) return res.sendResResult(0,'数据库 err 异常')
        if(results === null || results.length === 0) return res.sendResResult(0,'数据库无记录')
        res.sendResResult(1,'success',{userList: results})
    })
}

// 根据 id 修改用户信息的昵称和邮箱
exports.modifyUser = (req,res) => {
    const user = req.body;
    console.log(user);
    const sql =  'update cms_user set nickname = ? ,email =? where id= ?'
    connection.query(sql,[user.nickname,user.email,user.id],
        (err,results) => {
            if(err) return res.sendResResult(0,'数据库 err 异常')
            if(results.affectedRows === 0) return res.sendResResult(0,'修改失败')
            res.sendResResult()
        })
}


// 根据 id  删除用户信息
exports.delUser = (req,res) => {
    const id = req.params.id;
    console.log(id);
    const sql = 'delete from cms_user where id = ?'
    connection.query(
        sql,
        id,
        (err,results) => {
            if(err) return res.sendResResult(0,'数据库 err 异常')
            if(results.affectedRows === 0) return res.sendResResult(0,'记录不存在，删除失败')
            res.sendResResult()
    })
}


// 管理员添加用户
exports.addUser = (req,res) => {
    // 管理员的id 为
    const admin_id = req.auth.id
    const user = req.body;

    // 保证账号的唯一性
    connection.query(
        'select * from cms_user where username =?',
        user.username,
        (err,results) => {
            if(err) return res.sendResResult(0,'数据库 err 异常')
            if( results.length !== 0) return  res.sendResResult(0,'查询存在记录，不能使用重复账号名')
            // 不存在该账号，进行添加新用户
            const  sql = 'insert into cms_user(username,password,created_by,created_date) value (?,?,?,?)'
            connection.query(
                sql,
                [user.username, user.password, admin_id, new Date()],
                (err,results) => {
                    if(err) return res.sendResResult(0,'数据库 err 异常')
                    if(results.affectedRows ===0) return  res.sendResResult(0,'添加失败')
                    res.sendResResult()

                }
            )
        }
    )


}


// 修改密码
exports.modifyPassword = (req,res) => {
   // console.log('req 是  ： ',req);
    const user = req.body; // 旧密码 新密码 确认密码
    const id = req.auth.id; // 登录用户的id
    // 对旧密码进行验证
    const sql = "select password from cms_user where id = ?"
    connection.query(
        sql,
        [id],
        (err,results) => {
            if(err) return res.sendResResult(0,'数据库 err 异常1')
            if(results.length === 0) return  res.sendResResult(0,'数据库中无记录')
            const flag = bcrypt.compareSync(user.old_password,results[0].password)
            // flag =false ,标识密码不一致
            if(!flag) return  res.sendResResult(0,'旧密码有误，请重新输入')


            // 旧密码输入正确
            connection.query(
                'update cms_user set password =?  where id =?',
                [encryptPassword(user.new_password),id],
                (err,results) => {
                    if(err) return res.sendResResult(0,'数据库 err 异常2')
                    if(results.affectedRows ===0 ) return  res.sendResResult(0,'重置密码失败')
                    res.sendResResult()
                }
                )



        }
    )




}













