const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

// Path to the CSV file
const csvFilePath = 'jbl_employee_id.csv';

// API endpoint (replace with your actual API endpoint)
const API_URL = 'https://camera-jamunahris.jamunabank.com.bd/api/employee/data/single';

// Function to read the CSV file and get employee IDs
function readEmployeeIds(filePath) {
  return new Promise((resolve, reject) => {
    const employeeIds = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Assuming the CSV has a column named 'id'
        employeeIds.push(row.id);
      })
      .on('end', () => {
        resolve(employeeIds);
      })
      .on('error', reject);
  });
}

const employee_image_list = [];

// Function to make API call for a single employee ID
async function callApiWithEmployeeId(employeeId) {
  try {
    const url = `${API_URL}/${employeeId}`;
    console.log(`fetching: ${url}`);
    
    const response = await axios.get(url);
    const data = {
        id: employeeId,
        employee_no: response.data.employee_no,
        name: response.data.name,
        image_local_path: response.data.image_local_path,
        base64: (response.data.image_base64 !== null && response.data.image_base64.length > 0) ? 1 : 0,
        image_path: response.data.image_path === null ? 0 : 1,
    };
    employee_image_list.push(data);
  } catch (error) {
    console.error(`Error for Employee ID ${employeeId}:`, error.message);
    const data = {
        id: employeeId,
        employee_no: error.message,
        name: 'ERROR',
        image_local_path: 'ERROR',
        base64: 'ERROR',
        image_path: 'ERROR',
    };
    employee_image_list.push(data);
  }
}
// Function to process employee IDs one by one
async function processEmployeeIds(employeeIds) {
  for (const id of employeeIds) {
    await callApiWithEmployeeId(id);
    // Adding a delay between API calls if necessary (e.g., 1 second)
    // await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

function writeCSV(data, filename){
    const header = Object.keys(data[0]).join(',') + '\n';
    const rowsData = data.map(row => Object.values(row).join(',')).join('\n') + '\n';
  
    fs.writeFileSync(filename, header + rowsData, 'utf8');
    console.log(`${filename} written successfully!`);
  };
  

// Main function to execute the process
async function main(req, res) {
  try {
    const employeeIds = await readEmployeeIds(csvFilePath);
    console.log('Employee IDs:', employeeIds);

    // Process each employee ID one at a time
    await processEmployeeIds(employeeIds);

    writeCSV(employee_image_list, 'employee_images.csv');

    console.log('All API calls completed.');
    res.send('completed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Start the process
main();
