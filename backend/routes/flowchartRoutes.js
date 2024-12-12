const express = require("express");
const {
  createFlowchart,
  getFlowchartById,
  updateFlowchart,
  deleteFlowchart,
  getAllFlowcharts,
  getOutgoingEdges,
  validateFlowchart,
} = require("../controllers/flowchartController");

const router = express.Router();

/**
 * @swagger
 * /api/flowcharts:
 *   get:
 *     summary: Get all flowcharts
 *     description: Retrieve a list of all flowcharts
 *     responses:
 *       200:
 *         description: Successfully retrieved flowcharts
 */
router.get("/", getAllFlowcharts);

/**
 * @swagger
 * /api/flowcharts/{id}:
 *   get:
 *     summary: Get flowchart by ID
 *     description: Retrieve details of a specific flowchart by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the flowchart
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved flowchart details
 */
router.get("/:id", getFlowchartById);


/**
 * @swagger
 * /api/flowcharts:
 *   post:
 *     summary: Create a new flowchart
 *     description: Create a flowchart with nodes and edges. The flowchart includes a name, nodes (array of strings), and edges (array of objects with from and to properties).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the flowchart
 *               nodes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of nodes in the flowchart
 *               edges:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: string
 *                       description: The starting node of the edge
 *                     to:
 *                       type: string
 *                       description: The ending node of the edge
 *     responses:
 *       201:
 *         description: Successfully created the flowchart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the flowchart was successfully created
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the flowchart
 *                     nodes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of nodes in the flowchart
 *                     edges:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           from:
 *                             type: string
 *                             description: The starting node of the edge
 *                           to:
 *                             type: string
 *                             description: The ending node of the edge
 *       400:
 *         description: Invalid request body or data
 *       500:
 *         description: Internal server error
 */
router.post("/", createFlowchart);


/**
 * @swagger
 * /api/flowcharts/{id}:
 *   put:
 *     summary: Update an existing flowchart
 *     description: Update a flowchart by providing the flowchart ID and the new details (name, nodes, and edges).
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the flowchart to update
 *         required: true
 *         schema:
 *           type: string
 *           example: "60a7bce3f5f14d1f9e908d7d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the flowchart.
 *                 example: "Updated Flowchart"
 *               nodes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of node names in the flowchart.
 *                 example: ["Start", "Process", "End"]
 *               edges:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: string
 *                       description: Starting node of the edge.
 *                       example: "Start"
 *                     to:
 *                       type: string
 *                       description: Ending node of the edge.
 *                       example: "Process"
 *                 description: List of edges connecting nodes in the flowchart.
 *                 example: [{"from": "Start", "to": "Process"}, {"from": "Process", "to": "End"}]
 *     responses:
 *       200:
 *         description: Successfully updated flowchart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the flowchart was updated successfully.
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the updated flowchart.
 *                       example: "Updated Flowchart"
 *                     nodes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of nodes in the updated flowchart.
 *                       example: ["Start", "Process", "End"]
 *                     edges:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           from:
 *                             type: string
 *                             description: Starting node of the edge.
 *                             example: "Start"
 *                           to:
 *                             type: string
 *                             description: Ending node of the edge.
 *                             example: "Process"
 *                       description: List of edges in the updated flowchart.
 *                       example: [{"from": "Start", "to": "Process"}, {"from": "Process", "to": "End"}]
 *       400:
 *         description: Invalid input or missing required fields
 *       404:
 *         description: Flowchart not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateFlowchart);

/**
 * @swagger
 * /api/flowcharts/{id}:
 *   delete:
 *     summary: Delete a flowchart by ID
 *     description: Delete a specific flowchart by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the flowchart to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted flowchart
 */
router.delete("/:id", deleteFlowchart);


/**
 * @swagger
 * /api/flowcharts/{id}/outgoing/{nodeName}:
 *   get:
 *     summary: Get outgoing edges for a specific node
 *     description: Retrieve the outgoing edges for a specific node in a flowchart.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the flowchart
 *         required: true
 *         schema:
 *           type: string
 *       - name: nodeName
 *         in: path
 *         description: The name of the node for which to fetch outgoing edges
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched outgoing edges for the node
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 edges:
 *                   type: array
 *                   description: List of outgoing edges for the node
 *                   items:
 *                     type: object
 *                     properties:
 *                       from:
 *                         type: string
 *                         description: The node from which the edge originates
 *                       to:
 *                         type: string
 *                         description: The destination node of the outgoing edge
 *       404:
 *         description: Flowchart or node not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id/outgoing/:nodeName", getOutgoingEdges);

/**
 * @swagger
 * /api/flowcharts/{id}/validate:
 *   get:
 *     summary: Validate a specific flowchart
 *     description: Validate the flowchart to check for any errors like disconnected nodes or cycles.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the flowchart
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flowchart is valid or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                   description: Whether the flowchart is valid or not
 *                 errors:
 *                   type: array
 *                   description: List of errors, if any
 *                   items:
 *                     type: string
 *       404:
 *         description: Flowchart not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id/validate", validateFlowchart);





module.exports = router;
