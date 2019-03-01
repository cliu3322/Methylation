#!/bin/bash

## raw reads fastqc
fastqc -o /mnt/Bioinfo_Student/Ting_Gong/EpiQC_data/NYGC_NA12878_A/Fastqc/ NA12878v1-Bstag_ACTGAGCG_H3Y7GALXX_L001_001.R1.fastq NA12878v1-Bstag_ACTGAGCG_H3Y7GALXX_L001_001.R2.fastq NA12878v2-Bstag_ACTGAGCG_H3Y7GALXX_L002_001.R1.fastq NA12878v2-Bstag_ACTGAGCG_H3Y7GALXX_L002_001.R2.fastq
##ERIC
fastqc -o ./result/Fastqc/ ../test_data/test1.fastq ../test_data/test2.fastq





## trim galore: auto detect adapters & trim low quality reads (input and output directory should be different)
output="/output/folder/direction"
input="/input/folder/direction"
trim_galore --paired --trim1 HG003_TAAGGCGA_HHLY2ALXX_L002_001.R1.fastq HG003_TAAGGCGA_HHLY2ALXX_L002_001.R2.fastq
##ERIC
output="./result/trim_galor/"
trim_galore --paired --trim1 -o ${output} ../test_data/test1.fastq ../test_data/test2.fastq

## trimmed reads fastqc
fastqc -o /output/folder/direction inputfile1.fq inputfile2.fq ... inputfilen.fq
##ERIC
fastqc -o ./result/trimed_Fastqc/ ./result/trim_galor/test1_val_1.fq ./result/trim_galor/test2_val_2.fq


## Alignment - Bismark Pipeline
## Genome preparation
bismark_genome_preparation --bowtie2 /path/to/genome/
##ERIC
##(long, no need to do it)
bismark_genome_preparation --bowtie2 ./genome/hg38

## Creat test data (10000 reads) to see the direction of the paired fastq files
seqtk sample -s100 input.fastq 10000 > output.fastq
##ERIC
##(NO NEED RIGHT NOW)

## Use Bismark to test the sequence direction
bismark /mnt/Bioinfo_Student/Ting_Gong/hg19 -o test -1 L002_001.R1.test_val_1.fq -2 L002_001.R2.test_val_2.fq --parallel 4 -p 4 --score_min L,0,-0.6 --non_directional
## ERIC
bismark ./genome/hg38 -o ./result/align_result/Bismark -1 ./result/trim_galor/test1_val_1.fq -2 ./result/trim_galor/test2_val_2.fq --parallel 4 -p 4 --score_min L,0,-0.6 --non_directional
## Alignment-Bismark after test for direction
bismark /mnt/Bioinfo_Student/Ting_Gong/hg38 -o bismark -1 L002_001.R2.test_val_2.fq -2 L002_001.R1.test_val_1.fq --parallel 4 -p 4 --score_min L,0,-0.6 -X 1000
cat NYGC_NA12878_A_1_PE_report.txt





## Alignment - BWA-METH Pipeline
## Genome preparation
bwameth.py index genome.fa
## Alignment
bwameth.py --reference genome.fa NA12878v1-Bstag_ACTGAGCG_H3Y7GALXX_L001_001.R1_val_1.fq NA12878v1-Bstag_ACTGAGCG_H3Y7GALXX_L001_001.R2_val_2.fq -t 12 | samtools view -b - > NYGC_NA12878_A_bwameth.bam




## Alignment - BS_seek2 Pipeline
## Genome preparation
bs_seeker2-build.py -f direction/to/genome.fa --aligner=bowtie
## Single end alignment using each strand
bs_seeker2-align.py -i /mnt/Bioinfo_Student2/Ting_Gong/12-14-16_Sample_HG004/test1.fq --aligner=bowtie -o /mnt/Bioinfo_Student2/Ting_Gong/12-14-16_Sample_HG004/test1.bam -f bam -g /mnt/Bioinfo_Student2/Ting_Gong/Ting_Gong/hg38/hg38.fasta
bs_seeker2-align.py -i /mnt/Bioinfo_Student2/Ting_Gong/12-14-16_Sample_HG004/test2.fq --aligner=bowtie -o /mnt/Bioinfo_Student2/Ting_Gong/12-14-16_Sample_HG004/test2.bam -f bam -g /mnt/Bioinfo_Student2/Ting_Gong/Ting_Gong/hg38/hg38.fasta
## merge the two single-end alignments into one
samtools merge test.bam test1.bam test2.bam




## Alignment - BitmapperBS Pipeline
## Genome preparation
./bitmapperBS --index /mnt/Bioinfo_Student2/Ting_Gong/Ting_Gong/hg38_bitmapperBS/hg38.fasta
##ERIC
./bitmapperBS --index ./genome/hg38/hg38.fasta

## alignment
./bitmapperBS --search /mnt/Bioinfo_Student2/Ting_Gong/Ting_Gong/hg38_bitmapperBS/hg38.fasta --seq1 /mnt/Bioinfo_Student2/Ting_Gong/12-14-16_Sample_HG004/test2.fq --seq2 /mnt/Bioinfo_Student2/Ting_Gong/12-14-16_Sample_HG004/test1.fq --pe --bam -o test.bam

## Alignment - gemBS Pipeline (in progress)




## Deduplication
samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 input.bam > output_filter.bam

## Methylation extract - only bam from bismark pipeline
bismark_methylation_extractor --bedGraph --gzip output_filter.bam

## Methylation extract - bam from all pipelines
## sort filtered bam file
picard -Xmx32G SortSam INPUT=output_filter.bam OUTPUT=output_filter_sort.bam SORT_ORDER=coordinate
## Create Bai file from filtered and sorted Bam file
samtools index output_filter_sort.bam
## methylation extraction
MethylDackel extract hg38.fa HG002_1_bwameth.deduplicated_sort.bam

## Plot with goleft
goleft indexcov --d /mnt/Bioinfo_Student/Ting_Gong/EpiQC_data/NYGC_NA12878_A/DownSamplingCoverage/NYGC_NA12878_A_1/ NYGC_NA12878_A_1_pe.deduplicated_5.bam NYGC_NA12878_A_1_pe.deduplicated_10.bam NYGC_NA12878_A_1_pe.deduplicated_20.bam NYGC_NA12878_A_1_pe.deduplicated_30.bam NYGC_NA12878_A_1_pe.deduplicated_sort.bam
