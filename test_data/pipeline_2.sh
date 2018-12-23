#!/bin/bash

## raw reads fastqc
fastqc -o /mnt/Bioinfo_Student/Ting_Gong/EpiQC_data/NYGC_NA12878_A/Fastqc/ NA12878v1-Bstag_ACTGAGCG_H3Y7GALXX_L001_001.R1.fastq NA12878v1-Bstag_ACTGAGCG_H3Y7GALXX_L001_001.R2.fastq NA12878v2-Bstag_ACTGAGCG_H3Y7GALXX_L002_001.R1.fastq NA12878v2-Bstag_ACTGAGCG_H3Y7GALXX_L002_001.R2.fastq

## trimmomatic to remove adapters
java -jar trimmomatic-0.36.jar PE ../uploads/test1.fastq ../uploads/test2.fastq ILLUMINACLIP:TruSeq3-PE.fa:2:30:10 LEADING:3 TRAILING:3 SLIDINGWINDOW:4:15 MINLEN:36

## trim galore: auto detect adapters & trim low quality reads (input and output directory should be different)
output="/mnt/Bioinfo_Student/Ting_Gong/EpiQC_data/08-22-17_Sample_HG002/Trim_galore/"
input="/mnt/Bioinfo_Student/Ting_Gong/EpiQC_data/08-22-17_Sample_HG002/"
trim_galore -q 20 --stringency 5 --paired --length 20 -o ${output} ${input}HG002_TGCAGCTA_HHLY2ALXX_L001_001.R1.fastq ${input}HG002_TGCAGCTA_HHLY2ALXX_L001_001.R2.fastq


##?question
trim_galore --paired --trim1 HG003_TAAGGCGA_HHLY2ALXX_L002_001.R1.fastq HG003_TAAGGCGA_HHLY2ALXX_L002_001.R2.fastq

## trimmed reads fastqc
fastqc -o /mnt/Bioinfo_Student/Ting_Gong/EpiQC_data/NYGC_NA12878_A/Fastqc_trimmed/ NA12878v1-Bstag_ACTGAGCG_H3Y7GALXX_L001_001.R1_val_1.fq NA12878v1-Bstag_ACTGAGCG_H3Y7GALXX_L001_001.R2_val_2.fq

## Genome preparation
bismark_genome_preparation --bowtie2 /path/to/genome/


## if we need this???
bismark_genome_preparation --bowtie2 ../../../Methylation/hg38/

## Creat test data (10000 reads) to see the direction of the paired fastq files
seqtk sample -s100 input.fastq 10000 > output.fastq

## Use Bismark to test the sequence direction
bismark /mnt/Bioinfo_Student/Ting_Gong/hg19 -o test -1 L002_001.R1.test_val_1.fq -2 L002_001.R2.test_val_2.fq --parallel 4 -p 4 --score_min L,0,-0.6 --non_directional
bismark ../../../Methylation/hg38/ -o test -1 L002_001.R1.test_val_1.fq -2 L002_001.R2.test_val_2.fq --parallel 4 -p 4 --score_min L,0,-0.6 --non_directional


## Alignment-Bismark after test for direction
bismark /mnt/Bioinfo_Student/Ting_Gong/hg38 -o bismark -1 L002_001.R2.test_val_2.fq -2 L002_001.R1.test_val_1.fq --parallel 4 -p 4 --score_min L,0,-0.6 -X 1000
cat NYGC_NA12878_A_1_PE_report.txt

## Alignment-BWA-METH
bwameth.py index genome.fa
bwameth.py --reference genome.fa NA12878v1-Bstag_ACTGAGCG_H3Y7GALXX_L001_001.R1_val_1.fq NA12878v1-Bstag_ACTGAGCG_H3Y7GALXX_L001_001.R2_val_2.fq -t 12 | samtools view -b - > NYGC_NA12878_A_bwameth.bam

## Deduplication
deduplicate_bismark --bam NYGC_NA12878_A_1_pe.bam

## Extract mapped/primary reads (Double check the deduplicate_bismark results)
samtools view -b -F 4 NYGC_NA12878_A_1_pe.deduplicated.bam > NYGC_NA12878_A_1_pe.mapped.bam
samtools view -b -F 260 NYGC_NA12878_A_1_pe.deduplicated.bam -h > NYGC_NA12878_A_1_pe.major.bam

samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 L002_001.R2.test_val_2_bismark_bt2_pe.bam > L002_001.R2.test_val_2_bismark_bt2_pe.filter.bam

## Methylation extract （don't use sorted by coordinate bam file)
bismark_methylation_extractor --bedGraph --gzip NYGC_NA12878_A_1_pe.mapped.bam

## Picard sortsam
picard -Xmx32G SortSam INPUT=NYGC_NA12878_A_1_pe.deduplicated.bam OUTPUT=NYGC_NA12878_A_1_pe.deduplicated_sort.bam SORT_ORDER=coordinate

## Add downsampling
samtools view -s 0.05 -b -h NYGC_NA12878_A_1_pe.deduplicated_sort.bam > NYGC_NA12878_A_1_pe.deduplicated_5.bam
samtools view -s 0.1 -b -h NYGC_NA12878_A_1_pe.deduplicated_sort.bam > NYGC_NA12878_A_1_pe.deduplicated_10.bam
samtools view -s 0.2 -b -h NYGC_NA12878_A_1_pe.deduplicated_sort.bam > NYGC_NA12878_A_1_pe.deduplicated_20.bam
samtools view -s 0.3 -b -h NYGC_NA12878_A_1_pe.deduplicated_sort.bam > NYGC_NA12878_A_1_pe.deduplicated_30.bam

## Calculate coverage of downsampling
## https://github.com/arq5x/bedtools-protocols/blob/master/bedtools.md
bedtools genomecov -ibam NA19146.bam > NA19146.coverage.hist.txt

## Plot Using goleft and SeqMonk
## Create Bai file from Bam file
samtools index NYGC_NA12878_A_1_pe.deduplicated_5.bam
samtools index NYGC_NA12878_A_1_pe.deduplicated_10.bam
samtools index NYGC_NA12878_A_1_pe.deduplicated_20.bam
samtools index NYGC_NA12878_A_1_pe.deduplicated_30.bam
## goleft
goleft indexcov --d /mnt/Bioinfo_Student/Ting_Gong/EpiQC_data/NYGC_NA12878_A/DownSamplingCoverage/NYGC_NA12878_A_1/ NYGC_NA12878_A_1_pe.deduplicated_5.bam NYGC_NA12878_A_1_pe.deduplicated_10.bam NYGC_NA12878_A_1_pe.deduplicated_20.bam NYGC_NA12878_A_1_pe.deduplicated_30.bam NYGC_NA12878_A_1_pe.deduplicated_sort.bam

## Methylation extract of downsampling files
## Unsorted downsampling files
samtools view -s 0.05 -b -h NYGC_NA12878_A_1_pe.deduplicated.bam > NYGC_NA12878_A_1_pe.deduplicated_unsort_5.bam
bismark_methylation_extractor --bedGraph --gzip NYGC_NA12878_A_1_pe.deduplicated_unsort_5.bam

## MethylDackel, after sorted and creat index file
MethylDackel extract hg38.fa HG002_1_bwameth.deduplicated_sort.bam
