#!/usr/bin/env node

//  used for creating CLI
const program = require('commander');

//  Tinypng module
const tinify = require('tinify');

const TINYPNG_API_KEY = '{{API_KEY}}';

/*  version and description */
program
    .version('1.0.0')
    .description('Colors - Image compression program using Tinypng API');

/*  validate API key  */
program
    .option('-k, --validate-key', 'validate Tinypng API Key', () => {
        tinify.key = TINYPNG_API_KEY;
        tinify.validate((err) => {
            if (err)
                console.log('Error: Credentials are invalid (HTTP 401/Unauthorized)');
            else
                console.log('Success: Validation successful');
        });
    });

/*  displays number of compressions made  */
program
    .option('-c, --compression-count', 'displays number of compressions made', () => {
        let compressionsThisMonth = tinify.compressionCount || 0;
        console.log('Total number of Compressions this month: ', compressionsThisMonth);
    });

/*  compress image  */
program
    .option('-i, --input <input_file> <output_file>', 'compresses the uploaded image', () => {
        let inputFilePath = process.argv[2];
        let outputFilePath = process.argv[3] || inputFilePath;

        tinify.key = TINYPNG_API_KEY;

        let source = tinify.fromFile(inputFilePath);
        source.toFile(outputFilePath)
            .then(() => {
                console.log('> Success: Image successfully compressed.');
            })
            .catch((err) => {
                if (err instanceof tinify.AccountError) {
                    console.log('> Error: ' + err.message);
                } else if (err instanceof tinify.ClientError) {
                    console.log('> Error: check source image');
                } else if (err instanceof tinify.ServerError) {
                    console.log('> Error: temporary issue with TinyPng API');
                } else if (err instanceof tinify.ConnectionError) {
                    console.log('> Error: network error. Check connection and try again.')
                } else {
                    console.log('> Error: Unknown error has occurred');
                }
            });
    });

program.parse(process.argv);