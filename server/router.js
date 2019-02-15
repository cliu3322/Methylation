import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import FileDetail from './models/FileDetail';
const { exec } = require('child_process');
const fs = require('fs');



export default function (app) {


  app.use('/result', express.static('../result/'))

  const apiRoutes = express.Router();


  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, 'test1.fastq')
    }
  })

  // var upload = multer({ storage: storage })

  var upload1 = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5 // max 5MB file
    }
  });


  var storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, 'test2.fastq')
    }
  })

  // var upload = multer({ storage: storage })

  var upload2 = multer({
    storage: storage2,
    limits: {
      fileSize: 1024 * 1024 * 5 // max 5MB file
    }
  });





  apiRoutes.post("/uploadFile1", upload1.single('file'), function (req, res, next) {
    res.status(201).json({
      message: "File uploaded successfully",
      fileName:req.file.originalname
    });
  });


  apiRoutes.post("/uploadFile2", upload2.single('file'), function (req, res, next) {
    res.status(201).json({
      message: "File uploaded successfully",
      fileName:req.file.originalname
    });
  });

  //bismark /Users/chunyiliu/Methylation/hg38 -o bismark -1 ./uploads/test1.fq -2 ./uploads/test2.fq --parallel 4 -p 4 --score_min L,0,-0.6 -X 1000



  apiRoutes.get('/trim1', function (req, res) {
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

  apiRoutes.get('/trim2', function (req, res) {

    exec('cd Trimmomatic-0.36/ && pwd && cd..', (err, stdout, stderr) => {
      console.log(stdout);
      exec('pwd', (err, stdout, stderr) => {
        console.log(stdout);

      });
    });
  });

  apiRoutes.get('/extractPrimaryReads', function (req, res) {
//samtools view -b -F 4 ./result/duplicate_result/test2_bismark_bt2_pe.deduplicated.bam > ./result/extractPrimaryReads_result/NYGC_NA12878_A_1_pe.mapped.bam

    exec('samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 ./result/filter_result/test2_bismark_bt2_pe.bam > ./result/extractPrimaryReads_result/L002_001.R2.test_val_2_bismark_bt2_pe.filter.bam', (err, stdout, stderr) => {
      res.status(201).json({
        fileName: 'L002_001.R2.test_val_2_bismark_bt2_pe.filter.bam',
        isExtractPrimaryReads:true,
      })
    });
  });

  apiRoutes.get('/deplicate', function (req, res) {

    exec('deduplicate_bismark --bam ./result/align_result/test2_bismark_bt2_pe.bam --output_dir ./result/duplicate_result/', (err, stdout, stderr) => {
      res.status(201).json({
        fileName: 'L002_001.R2.test_val_2_bismark_bt2_pe.filter.bam',
        isExtractPrimaryReads:true,
      })
    });
  });

  apiRoutes.get('/trim', function (req, res) {
    exec('fastqc -o ../result/Fastqc/ ../uploads/'+ JSON.parse(req.query.filesName).file1+' ../uploads/'+JSON.parse(req.query.filesName).file2,
    (err1, stdout1, stderr1) => {
      exec('cd Trimmomatic-0.36 && java -jar trimmomatic-0.36.jar PE ../uploads/'+ JSON.parse(req.query.filesName).file1+' ../uploads/'+JSON.parse(req.query.filesName).file2+' ILLUMINACLIP:TruSeq3-PE.fa:2:30:10 LEADING:3 TRAILING:3 SLIDINGWINDOW:4:15 MINLEN:36 && cd ..',
      (err, stdout2, stderr) => {
        exec('trim_galore -q 20 --stringency 5 --paired --length 20 -o ../result/trim_galor/ '+
          '../uploads/'+JSON.parse(req.query.filesName).file1+
          ' ../uploads/'+JSON.parse(req.query.filesName).file2,
        (err, stdout3, stderr) => {
          exec('fastqc -o ../result/trimmed_result/ ./result/trim_galor/'+
          JSON.parse(req.query.filesName).file1.replace(".fastq", "_val_1.fq")+
          ' ../result/trim_galor/'+
          JSON.parse(req.query.filesName).file2.replace(".fastq", "_val_2.fq"),
          (err, stdout4, stderr) => {
            res.status(201).json({
              file1:JSON.parse(req.query.filesName).file1.replace(".fastq", "_val_1_fastqc.html"),
              file2:JSON.parse(req.query.filesName).file2.replace(".fastq", "_val_2_fastqc.html"),
              fqFilesName1:JSON.parse(req.query.filesName).file1.replace(".fastq", "_val_1.fq"),
              fqFilesName2:JSON.parse(req.query.filesName).file2.replace(".fastq", "_val_2.fq"),
              result1:stdout1,
              result2:stdout2,
              result3:stdout3,
              result4:stdout4,
              isTrimCompleted:true,
            });
          });
        });
      });

    });
  });

  apiRoutes.get('/align', function (req, res) {
    console.log('bismark ../../../Methylation/hg38/ -o bismark '+
    './result/trim_galor/'+JSON.parse(req.query.filesName).fqFile1+' q -2 '+
    './result/trim_galor/'+JSON.parse(req.query.filesName).fqFile2+' --parallel 4 -p 4 --score_min L,0,-0.6 -X 1000');

    console.log(JSON.parse(req.query.filesName))
    exec('bismark ../../../Methylation/hg38/ -o bismark '+
    './result/trim_galor/'+JSON.parse(req.query.filesName).fqFile1+' q -2 '+
    './result/trim_galor/'+JSON.parse(req.query.filesName).fqFile2+' --parallel 4 -p 4 --score_min L,0,-0.6 -X 1000',
    (err, stdout, stderr) => {
      console.log('go align');
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
      console.log(stdout);
      console.log(stderr);
      res.status(201).json({
        file1:JSON.parse(req.query.filesName).file1,
        file2:JSON.parse(req.query.filesName).file2,
        result:stdout,
        isAlignCompleted:true,
      });
    });
  });


  app.use('/api', apiRoutes);
};
