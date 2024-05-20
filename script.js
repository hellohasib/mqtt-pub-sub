
const fs = require('fs');
const mqtt = require('mqtt');
const csv = require('csv-parser');

const brokerUrl = 'mqtt://172.8.9.47'; // Replace with your broker URL
// const brokerUrl = 'mqtt://103.180.245.45';

// Create a client instance
const client = mqtt.connect(brokerUrl, {
  clientId: "jbl-backend-pub",
  username: "admin",
  password: "public",
  port: "1883"
});
const retain_qos = {
  retain: true,
  qos: 2,
};

const csvFilePath = '2024-05-15-Mohakhali_Ext.csv'; // Replace with the actual path to your CSV file

const topic = 'jbl/attendance/2';
const DELAY_TIME = 5000; // in milliseconds
function processRow(row) {
  // Process the current row and do whatever you need
//   console.log(row.employee_id, row.time);

  const message = JSON.stringify({ employee_id: row.employee_id, time: row.time , confidence_score: row.confidence, employee_no: row.employee_id, entry_exit_type: row.camera_no, branch_id : row.branch_id });

  client.on('connect', () => {
    console.log('Publisher connected to MQTT broker');
    // console.log("the message: ", message)
    // client.publish(topic, message, retain_qos);
    // console.log('Successfully Published to ', topic)
    setTimeout(() => {
      console.log("the message: ", message)
      client.publish(topic, message, retain_qos);
      console.log('Successfully Published to ', topic)
  }, DELAY_TIME);
  });

  // If you want to accumulate the rows into an array, you can do it here
  // Example: jsonDataArray.push(row);
}

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Call the processRow function for each row
    processRow(row);
  })
  .on('end', () => {
    // All rows have been processed
    // If you accumulated rows into an array, you can use it here
    // Example: console.log(jsonDataArray);
  });
