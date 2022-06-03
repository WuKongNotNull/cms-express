# cms-express
基于 Express 的后端内容管理系统 CMS ，采用前后端分离方式进行开发，接口设计遵循 Restfull 风格。

## 技术选型
- Express
- node
- mysql8.x
- apifox
- webstorm


## API 文档
https://www.apifox.cn/apidoc/shared-76eed25f-a27a-4c2c-b27c-f97659113b16


## 数据库脚本
```mysql
create database  db_cms;

use  db_cms;

create table cms_user
(
    avatar       varchar(50)  null,
    id           int auto_increment comment '主键 ID'
        primary key,
    username     varchar(20)  null comment '用户账号',
    password     varchar(100) null comment '用户密码',
    nickname     varchar(20)  null comment '昵称',
    email        varchar(100) null comment '用户邮箱',
    created_by   int          null comment '创建人',
    created_date datetime     null comment '创建时间',
    modify_by    int          null comment '修改人',
    modify_date  datetime     null comment '修改时间',
    role_id      int          null
)
    comment '用户表';

INSERT INTO db_cms.cms_user (avatar, id, username, password, nickname, email, created_by, created_date, modify_by, modify_date, role_id) VALUES (null, 65, 'wukong', null, '悟空非空也', '1390128154@qq.com', null, null, null, null, null);
INSERT INTO db_cms.cms_user (avatar, id, username, password, nickname, email, created_by, created_date, modify_by, modify_date, role_id) VALUES (null, 66, 'zhubajie', null, '猪八戒', 'zhubajie@qq.com', null, null, null, null, null);
INSERT INTO db_cms.cms_user (avatar, id, username, password, nickname, email, created_by, created_date, modify_by, modify_date, role_id) VALUES (null, 67, 'tangseng', null, '唐僧', 'tangseng@qq.com', null, null, null, null, null);
INSERT INTO db_cms.cms_user (avatar, id, username, password, nickname, email, created_by, created_date, modify_by, modify_date, role_id) VALUES (null, 68, 'shaseng', null, '沙僧', 'shaseng@qq.com', null, null, null, null, null);
INSERT INTO db_cms.cms_user (avatar, id, username, password, nickname, email, created_by, created_date, modify_by, modify_date, role_id) VALUES (null, 69, 'admin', '$2a$04$zl7UYtKUe/50Z10vvguvqenYKrPjqAuY4qyTcYkv.q2AsStGSKXf2', null, null, 69, '2022-06-04 00:21:31', null, null, null);


# 创建角色表
create table cms_role
(
    role_id           int auto_increment comment '角色表的主键id'
        primary key,
    role_name         varchar(20) null comment '角色名称',
    role_created_by   int         null comment '创建人',
    role_created_date datetime    null comment '创建时间',
    role_modify_by    int         null comment '修改人',
    role_modify_date  datetime    null comment '修改时间'
)
    comment '角色表';


INSERT INTO db_cms.cms_role (role_id, role_name, role_created_by, role_created_date, role_modify_by, role_modify_date) VALUES (1, '管理员', null, null, null, null);
INSERT INTO db_cms.cms_role (role_id, role_name, role_created_by, role_created_date, role_modify_by, role_modify_date) VALUES (2, '创作者', null, null, null, null);
INSERT INTO db_cms.cms_role (role_id, role_name, role_created_by, role_created_date, role_modify_by, role_modify_date) VALUES (3, '普通会员', null, null, null, null);
INSERT INTO db_cms.cms_role (role_id, role_name, role_created_by, role_created_date, role_modify_by, role_modify_date) VALUES (4, '充值会员', null, null, null, null);
INSERT INTO db_cms.cms_role (role_id, role_name, role_created_by, role_created_date, role_modify_by, role_modify_date) VALUES (5, '运营', null, null, null, null);

# role_name ---> role_id ---> ps_id --->ps_name

# 权限表
create table cms_permission
(
    ps_id    int unsigned auto_increment
        primary key,
    ps_name  varchar(20)       not null comment '权限名称',
    ps_pid   smallint unsigned not null comment '父id',
    ps_level int default 0     not null comment '权限等级'
)
    comment '权限表' charset = utf8;

INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (1, '文章管理', 0, 1);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (2, '用户管理', 0, 1);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (3, '角色管理', 0, 1);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (11, '添加文章', 1, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (12, '删除文章', 1, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (13, '修改文章', 1, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (14, '文章列表', 1, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (15, '文章详情', 1, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (21, '添加用户', 2, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (22, '删除用户', 2, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (23, '修改用户', 2, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (24, '用户列表', 2, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (25, '用户详情', 2, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (31, '添加角色', 3, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (32, '删除角色', 3, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (33, '修改角色', 3, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (34, '角色列表', 3, 2);
INSERT INTO db_cms.cms_permission (ps_id, ps_name, ps_pid, ps_level) VALUES (35, '角色详情', 3, 2);

# 角色权限表
create table cms_role_ps
(
    role_ps_id int auto_increment comment '角色权限表主键'
        primary key,
    role_id    int null comment '角色ID',
    ps_id      int null comment '权限 ID'
)
    comment '角色权限表';


# 插入角色权限记录
INSERT INTO db_cms.cms_role_ps (role_ps_id, role_id, ps_id) VALUES (1, 1, 1);
INSERT INTO db_cms.cms_role_ps (role_ps_id, role_id, ps_id) VALUES (2, 1, 2);
INSERT INTO db_cms.cms_role_ps (role_ps_id, role_id, ps_id) VALUES (3, 1, 3);
INSERT INTO db_cms.cms_role_ps (role_ps_id, role_id, ps_id) VALUES (4, 1, 11);
INSERT INTO db_cms.cms_role_ps (role_ps_id, role_id, ps_id) VALUES (5, 1, 12);
INSERT INTO db_cms.cms_role_ps (role_ps_id, role_id, ps_id) VALUES (6, 1, 13);
```
