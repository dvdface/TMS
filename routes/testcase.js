var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({dest: 'uploads/'})

// 默认跳转create页面
router.get('/', (req, res)=>{
    res.redirect(304, 'create')
})

// 用例创建页面
router.get('/create', (req, res)=>{
    res.render('testcase/create')
})


// 创建用例
router.post('/create', upload.any(), (req, res)=>{
    console.log(req.files)
    console.log(req.body)
    res.send(req.body + req.files)
})


// 查看指定用例
router.get('/view', (req, res)=>{
    res.send('view testcase')
})

// 显示用例删除页面
router.get('/delete', (req, res)=>{
    res.send('show testcase page')
})

// 删除指定用例
router.post('/delete', (req, res)=>{
    res.send('delete testcase')
})


// 用例编辑页面
router.get('/edit', (req, res)=>{
    res.send('show testcase edit page')
})


// 保存用例编辑结果
router.post('/edit', (req, res)=>{
    res.send('edit testcase')
})


// 显示用例执行页面
router.get('/run', (req, res)=>{
    res.send('show testcase run page')
})

// 提交用例执行结果
router.post('/run', (req, res)=>{
    res.send('submit testcase result')
})

module.exports = router