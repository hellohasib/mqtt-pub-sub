const mqtt = require('mqtt');
const fs = require('fs');

// // MQTT broker URL
// const brokerUrl = 'mqtt://103.191.179.232'; // Replace with your broker URL
// // const brokerUrl = 'mqtt://';

// // Create a client instance
// const client = mqtt.connect(brokerUrl, {
//   clientId: "jbl-backend-pub-1",
//   username: 'reddot-mqtt-user',
//   password: 'Jahciu9xusou8vie',
//   port: "1883"
// });

const brokerUrl = 'mqtt://172.23.211.26'; // Replace with your broker URL
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



// Publish a message with image and employee_id as JSON fields
// const topic = 'jbl/enrollment/7'; // Replace with the topic you want to publish to
// const imagePath = './Hasib.jpg'; // Replace with the path to your local image
// const employeeId = 125; // Replace with the employee ID
// const branchId = 3;
// const topic = 'jbl/attendance/1'; // Replace with the topic you want to publish to
// const topic = 'jbl/enrollment/11';
 const topic = "jbl/enrollment/63";
 const imagePath = './2024051613s.png'; // Replace with t he path to your local image
const employeeId = '2024051613s'; // Replace with the employee ID
const name = '2024051613s';
const branchId = 11;
const confidenceScore = 0.85;
const entryExitType = 0;
const time = "2024-05-25 11:01:54"; 

fs.readFile(imagePath, (err, data) => {
  if (err) {
    console.error('Error reading image:', err); 
    return;
  }

   const imageBase64 = data.toString('base64');
   const message = JSON.stringify({ image: imageBase64, employee_id: employeeId , employee_no: employeeId, name: name });
  // const message = JSON.stringify({ employee_id : employeeId, time: time   });
  // const message = JSON.stringify({  employee_id : employeeId });

  client.on('connect', () => {
    console.log('Publisher connected to MQTT broker');
    console.log("the message: ", message)
    client.publish(topic, message, retain_qos);
    console.log('Successfully Published to ', topic)
  });

  // Handle errors
  client.on('error', (error) => {
    console.error('Publisher error:', error);
  });
});
