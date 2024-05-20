const mqtt = require('mqtt');

// MQTT broker URL
const brokerUrl = 'mqtt://172.8.9.47'; // Replace with your broker URL
//  const brokerUrl = 'mqtt://103.180.245.45';

// Create a client instance
const client = mqtt.connect(brokerUrl, {
  clientId: "jbl-backend-sub",
  username: "admin",
  password: "public",
  port: "1883"
});


// Subscribe to a topic 
// const topic = 'jbl/enrollment/status/11'; // Replace with your desired topic
// const topic = 'jbl/attendance/11'; // Replace with your desired topic
// const topic = 'jbl/enrollment/status/11';
// const topic = 'jbl/cameraStatus/#'; // Replace with your desired topic
//  const topic = 'jbl/disenrollment/status/31'; // Replace with your desired topic
 const topic = 'jbl/disenrollment/22'

client.on('connect', () => {
  console.log('Subscriber connected to MQTT broker');
  client.subscribe(topic);
  console.log('Subscribed to topic: ', topic);
});
// const topicSegments = topic.split('/');
// const branchIDfromTopic = topicSegments[topicSegments.length - 1]
// // Handle incoming messages
client.on('message', (topic, message) => {
  console.log('Reached Here')
  console.log(`Received message on topic '${topic}': ${message.toString()}`);
});

// Handle errors
client.on('error', (error) => {
  console.error('Subscriber error:', error);
});
