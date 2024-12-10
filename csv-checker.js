const fs = require('fs');
const csv = require('csv-parser');

const firstFile = 'Mohakhali-HO_EID.csv';  // Path to the first CSV file
const secondFile = 'HO_EID.csv'; // Path to the second CSV file
const outputFile = 'missingIDs.csv'; // Output text file for missing employee IDs

let firstFileIDs = new Set();
let secondFileIDs = new Set();

// Read first CSV file and store employee IDs in a Set
function readFirstFile() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(firstFile)
            .pipe(csv())
            .on('data', (row) => {
                firstFileIDs.add(row.USR_ID);  // Assuming the header is 'employee_id'
            })
            .on('end', () => {
                resolve();
            })
            .on('error', reject);
    });
}

// Read second CSV file and store employee IDs in a Set
function readSecondFile() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(secondFile)
            .pipe(csv())
            .on('data', (row) => {
                secondFileIDs.add(row.USR_ID);  // Assuming the header is 'employee_id'
            })
            .on('end', () => {
                resolve();
            })
            .on('error', reject);
    });
}

// Compare the IDs and write the missing IDs to the output file
function findMissingIDs() {
    const missingIDs = [...firstFileIDs].filter(id => !secondFileIDs.has(id));
    
    if (missingIDs.length > 0) {
        fs.writeFile(outputFile, missingIDs.join('\n'), (err) => {
            if (err) throw err;
            console.log(`Missing employee IDs have been written to ${outputFile}`);
        });
    } else {
        console.log('No missing employee IDs found.');
    }
}

// Execute the operations in sequence
(async () => {
    try {
        await readFirstFile();
        await readSecondFile();
        findMissingIDs();
    } catch (error) {
        console.error('Error processing files:', error);
    }
})();
