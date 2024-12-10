const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Directory containing the images
const sourceFolder = './Employee_Images/';  // Update this path to your actual image folder

// Path for the output CSV file
const outputCsv = './employee_no.csv';

// Create CSV writer
const csvWriter = createCsvWriter({
    path: outputCsv,
    header: [
        {id: 'name', title: 'FILENAME'}
    ]
});

// Read the directory and extract the image names
fs.readdir(sourceFolder, (err, files) => {
    if (err) {
        console.error('Error reading the directory:', err);
        return;
    }

    // Filter the files to only include .jpg and .png images
    const imageFiles = files.filter(file => {
        const extension = path.extname(file);  // Get the file extension
        const fileNameWithoutExt = path.basename(file, extension);  // Get the filename without the extension
        // Check if the file is a .jpg or .png and if the filename length is 10 characters
        return (extension === '.png') && fileNameWithoutExt.length === 10;
    }
        

    );

    // Map the file names to an array of objects for CSV writing
    const records = imageFiles.map(file => ({ name: path.parse(file).name }));

    // Write the image names to the CSV file
    csvWriter.writeRecords(records)
        .then(() => {
            console.log('CSV file written successfully!');
        })
        .catch(err => {
            console.error('Error writing CSV file:', err);
        });
});