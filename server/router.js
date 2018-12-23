import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import FileDetail from './models/FileDetail';
const { exec } = require('child_process');
const fs = require('fs');



export default function (app) {


app.use('/Fastqc', express.static('result/Fastqc'))

const apiRoutes = express.Router();


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

// var upload = multer({ storage: storage })

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // max 5MB file
  }
});





apiRoutes.post("/uploadFile", upload.single('file'), function (req, res, next) {
  res.status(201).json({
    message: "File uploaded successfully",
    fileName:req.file.originalname
  });
});

//bismark /Users/chunyiliu/Methylation/hg38 -o bismark -1 ./uploads/test1.fq -2 ./uploads/test2.fq --parallel 4 -p 4 --score_min L,0,-0.6 -X 1000



apiRoutes.get('/trim', function (req, res) {
  exec('fastqc -o ./result/Fastqc/ ./uploads/'+ JSON.parse(req.query.filesName).file1+' ./uploads/'+JSON.parse(req.query.filesName).file2+' NA12878v2-Bstag_ACTGAGCG_H3Y7GALXX_L002_001.R1.fastq NA12878v2-Bstag_ACTGAGCG_H3Y7GALXX_L002_001.R2.fastq ',
  (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    res.status(201).json({
      file1:JSON.parse(req.query.filesName).file1,
      file2:JSON.parse(req.query.filesName).file2,
      result:stdout,
      isTrimCompleted:true,
    });
  });
});

apiRoutes.get('/getFileDetails', function (req, res) {

    FileDetail.find({ }).exec(function(err, files) {
        if (files) {

          res.status(201).json({

        allFilesDetail:files

      });
        } else {
          res.status(204).json({
        allFilesDetail:files
      });
        }
      });
  });


  app.use('/api', apiRoutes);
};
