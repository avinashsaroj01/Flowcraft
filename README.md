Flowchart API

This is a simple Flowchart API built with Node.js and Express.js. The API allows you to manage flowcharts, perform validations, and fetch outgoing edges and connected nodes.

Table of Contents
-----------------
- Installation
- Running the Backend
- API Endpoints
  - Create Flowchart
  - Update Flowchart
  - Get Flowchart by ID
  - Get Outgoing Edges
  - Validate Flowchart
  - Get Connected Nodes
  - Update Flowchart
  - Delete Flowchart
- Testing the API
- Swagger API Docs

Installation
------------
Follow the steps below to set up the project on your local machine:

1. Clone the repository

   Clone the repository to your local machine using the following command:
   
   git clone https://github.com/avinashsaroj01/Flowcraft.git

2. Navigate to the project folder

   cd flowchart-api

3. Install dependencies

   Install the necessary dependencies using npm:
   
   npm install

4. Set up environment variables

   Create a `.env` file in the root of the project directory and add your environment variables. You can use the following template:

   PORT=5000
   MONGO_URI=your-mongodb-uri

5. Connect to MongoDB

   Ensure that you have a running MongoDB instance or use a service like MongoDB Atlas. Add your connection string to the `MONGO_URI` variable in the `.env` file.

Running the Backend
------------------
To run the backend server, use the following command:

npm start

The server will start on the port defined in your `.env` file (default is 5000).

Accessing the API
-----------------
Once the server is running, you can access the API by navigating to:

- Base URL: http://localhost:5000/api/flowcharts

You can also access the Swagger API documentation by visiting:

- Swagger UI: http://localhost:5000/api-docs

API Endpoints
-------------
1. Create Flowchart

   POST /api/flowcharts

   Creates a new flowchart with a list of nodes and edges.

   Request Body:

   {
     "nodes": ["Start", "Middle", "End"],
     "edges": [
       { "from": "Start", "to": "Middle" },
       { "from": "Middle", "to": "End" }
     ]
   }

   Response:

   {
     "success": true,
     "data": {
       "_id": "flowchart-id",
       "nodes": ["Start", "Middle", "End"],
       "edges": [
         { "from": "Start", "to": "Middle" },
         { "from": "Middle", "to": "End" }
       ]
     }
   }

2. Update Flowchart

   PUT /api/flowcharts/{id}

   Updates a flowchart by ID.

   Path Parameters:
   - id: The ID of the flowchart to update.

   Request Body:

   {
     "nodes": ["Start", "Middle", "End", "New Node"],
     "edges": [
       { "from": "Start", "to": "Middle" },
       { "from": "Middle", "to": "End" },
       { "from": "Start", "to": "New Node" }
     ]
   }

   Response:

   {
     "success": true,
     "data": {
       "_id": "flowchart-id",
       "nodes": ["Start", "Middle", "End", "New Node"],
       "edges": [
         { "from": "Start", "to": "Middle" },
         { "from": "Middle", "to": "End" },
         { "from": "Start", "to": "New Node" }
       ]
     }
   }

3. Get Flowchart by ID

   GET /api/flowcharts/{id}

   Fetches a flowchart by its ID.

   Path Parameters:
   - id: The ID of the flowchart to retrieve.

   Response:

   {
     "success": true,
     "data": {
       "_id": "flowchart-id",
       "nodes": ["Start", "Middle", "End"],
       "edges": [
         { "from": "Start", "to": "Middle" },
         { "from": "Middle", "to": "End" }
       ]
     }
   }

4. Get Outgoing Edges

   GET /api/flowcharts/{id}/outgoing/{nodeName}

   Fetches outgoing edges for a specific node.

   Path Parameters:
   - id: The ID of the flowchart.
   - nodeName: The name of the node to get outgoing edges for.

   Response:

   {
     "success": true,
     "data": [
       { "from": "Start", "to": "Middle" },
       { "from": "Middle", "to": "End" }
     ]
   }

5. Validate Flowchart

   GET /api/flowcharts/{id}/validate

   Validates a specific flowchart to check for any errors like disconnected nodes or cycles.

   Path Parameters:
   - id: The ID of the flowchart to validate.

   Response:

   {
     "success": true,
     "data": {
       "isValid": true,
       "errors": []
     }
   }

6. Get Connected Nodes

   GET /api/flowcharts/{id}/connected/{nodeName}

   Fetches all nodes connected to a specific node, directly or indirectly.

   Path Parameters:
   - id: The ID of the flowchart.
   - nodeName: The name of the node to find all connected nodes for.

   Response:

   {
     "success": true,
     "data": ["Start", "Middle", "End"]
   }

7. Update Flowchart

   PUT /api/flowcharts/{id}

   Updates an existing flowchart by its ID with new nodes and edges.

   Path Parameters:
   - id: The ID of the flowchart to update.

   Request Body:
   {
     "nodes": ["Start", "Middle", "End"],
     "edges": [
       { "from": "Start", "to": "Middle" },
       { "from": "Middle", "to": "End" }
     ]
   }

   Response:
   {
     "success": true,
     "message": "Flowchart updated successfully"
   }

8. Delete Flowchart

   DELETE /api/flowcharts/{id}

   Deletes a flowchart by its ID.

   Path Parameters:
   - id: The ID of the flowchart to delete.

   Response:

   {
     "success": true,
     "message": "Flowchart deleted successfully"
   }

Testing the API
---------------
To run tests for the backend API, you will need to install Jest.

1. Install Jest

   If you haven't already installed Jest, you can add it by running:

   npm install --save-dev jest

2. Create a Test File

   Create a test file (e.g., `flowchart.test.js`) inside a `tests` directory and write your tests. Here's an example of a test for the `POST /api/flowcharts` endpoint:

   const request = require('supertest');
   const app = require('../index');  // Adjust the path to your app if necessary

   describe('Flowchart API', () => {
     it('should create a flowchart', async () => {
       const res = await request(app)
         .post('/api/flowcharts')
         .send({
           nodes: ['Start', 'Middle', 'End'],
           edges: [
             { from: 'Start', to: 'Middle' },
             { from: 'Middle', to: 'End' },
           ],
         });

       expect(res.status).toBe(200);
       expect(res.body.success).toBe(true);
       expect(res.body.data.nodes).toContain('Start');
     });
   });

3. Run Tests

   Run the tests using the following command:

   npm test

   Jest will automatically find and run all the test files. You can also run it in watch mode using:

   npm test -- --watch

   This will re-run tests automatically whenever you change a file.

Swagger API Docs
----------------
Swagger documentation for all available routes is available at:

- Swagger UI: http://localhost:5000/api-docs

This provides a visual representation of the API and allows you to interact with the endpoints directly from the browser.

License
-------
This project is licensed under the MIT License - see the LICENSE file for details.
