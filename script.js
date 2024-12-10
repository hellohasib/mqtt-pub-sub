const fs = require('fs');
const mqtt = require('mqtt');
const csv = require('csv-parser');

const brokerUrl = 'mqtt://172.23.211.26'; // Replace with your broker URL

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

const csvFilePath = 'query_results_ho.csv'; // Replace with the actual path to your CSV file

const topic = 'jbl/attendance/10';
const DELAY_TIME = 1600; // in milliseconds

client.on('connect', () => {
  console.log('Publisher connected to MQTT broker');
  
  let delayAccumulator = 0;

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      // Calculate delay for each row
      delayAccumulator += DELAY_TIME;

      setTimeout(() => {
        const message = JSON.stringify({
          employee_id: row.employee_id,
          time: row.time,
          confidence_score: row.confidence,
          employee_no: row.employee_id,
          entry_exit_type: row.camera_no,
          branch_id: row.branch_id
        });

        console.log("Publishing message:", message);
        client.publish(topic, message, retain_qos, (err) => {
          if (err) {
            console.error("Failed to publish message:", err);
          } else {
            console.log("Successfully published to", topic);
          }
        });
      }, delayAccumulator);
    })
    .on('end', () => {
      console.log('All rows have been processed.');
    });
});
