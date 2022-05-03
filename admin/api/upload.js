const { Router } = require('express');
const { json } = require('express/lib/response');
const router = Router();
const multer = require('multer');
const fs = require('fs');
import query from './db'

// storage setting for file
// storage default
const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    cb(null, 'static/img')
  },
  filename:  (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)// 파일 원본이름 저장
  }
})
const upload = multer({ storage: storage }); // 미들웨어 생성

router.post('/',upload.single('img'),(req, res, next) => {
	let fileName = req.body.newFileName;
	let file = req.file;
	let type = file.mimetype.replace(/image\//g,'.');
 	let newFileName = fileName?fileName+type:null;
	console.log('newFileName=',newFileName)
	if(newFileName){
		fs.rename(`static/img/${file.filename}`,`static/img/${newFileName}`,(error)=>{
			if(error){
			  	console.log(error)
			}	
		})
	}
	res.status(201).send({
		message: "이미지 저장 성공",
		fileInfo: req.file
	})
	
})
router.delete('/',(req,res)=>{
	let filePath  = req.body.filename;
	console.log(filePath)
	fs.unlink(`static${filePath}`,(err)=>{
		if(err){
			console.error(err)
			res.send('fail',err);
		}else{
			res.status(200).send('삭제완료');
		}
	})
})




module.exports = router