
const request = require('supertest');
const app = require('../index'); 
const mongoose = require('mongoose');
const Flowchart = require('../models/flowchart');  

beforeAll(async () => {
  const url = 'mongodb+srv://avinashsarojpersonal:avidb123@cluster0.jaer6.mongodb.net/flowcraft?retryWrites=true&w=majority&appName=Cluster0';  
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test for /api/flowcharts/:id/connected/:nodeName route
describe('GET /api/flowcharts/:id/connected/:nodeName', () => {
  
  let flowchartId;

  // Creating  a sample flowchart before running the test
  beforeAll(async () => {
    const flowchart = new Flowchart({
      name: 'Test Flowchart',
      nodes: ['Start', 'Middle', 'End'],
      edges: [
        { from: 'Start', to: 'Middle' },
        { from: 'Middle', to: 'End' },
      ],
    });
    const savedFlowchart = await flowchart.save();
    flowchartId = savedFlowchart._id;
  });

  it('should return all connected nodes for a specific node', async () => {
    const nodeName = 'Start';

    const response = await request(app)
      .get(`/api/flowcharts/${flowchartId}/connected/${nodeName}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(['Middle']);
  });

  it('should return 404 if flowchart or node is not found', async () => {
    const invalidFlowchartId = '607d1b3d8c97b2c9a3e4d7b0';  // Non-existent flowchart ID
    const nodeName = 'NonExistentNode';

    const response = await request(app)
      .get(`/api/flowcharts/${invalidFlowchartId}/connected/${nodeName}`)
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Flowchart or node not found');
  });

  it('should return 500 if there is a server error', async () => {
    const response = await request(app)
      .get('/api/flowcharts/invalidId/connected/Start')
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Internal server error');
  });
});
