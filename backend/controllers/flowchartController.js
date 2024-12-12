const Flowchart = require("../models/Flowchart");

// Create a new flowchart
exports.createFlowchart = async (req, res) => {
  const { name, nodes, edges } = req.body;
  try {
    const flowchart = new Flowchart({ name, nodes, edges });
    const savedFlowchart = await flowchart.save();
    res.status(201).json(savedFlowchart);
    console.log("flowchart saved successfully!",savedFlowchart);
  } catch (error) {
    res.status(500).json({ message: "Failed to create flowchart", error });
  }
};

// Fetch a flowchart by ID
exports.getFlowchartById = async (req, res) => {
  try {
    const flowchart = await Flowchart.findById(req.params.id);
    if (!flowchart) return res.status(404).json({ message: "Flowchart not found" });
    res.status(200).json(flowchart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch flowchart", error });
  }
};

//Fetch all  flowcharts
exports.getAllFlowcharts = async (req, res) => {
  try {
    const flowcharts = await Flowchart.find();
    res.status(200).json({
      success: true,
      message: "Flowcharts retrieved successfully",
      data: flowcharts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching flowcharts",
      error: error.message,
    });
  }
};


// Update Flowchart
exports.updateFlowchart = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Find the flowchart by ID and update it
    const flowchart = await Flowchart.findById(id);
    if (!flowchart) {
      return res.status(404).json({
        success: false,
        message: "Flowchart not found",
      });
    }

    // Update the flowchart with the new data
    flowchart.name = updatedData.name || flowchart.name;
    flowchart.nodes = updatedData.nodes || flowchart.nodes;
    flowchart.edges = updatedData.edges || flowchart.edges;

    // Save the updated flowchart
    await flowchart.save();

    // Return the updated flowchart
    res.status(200).json({
      success: true,
      message: "Flowchart updated successfully",
      data: flowchart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating flowchart",
      error: error.message,
    });
  }
};


// Delete a flowchart
exports.deleteFlowchart = async (req, res) => {
  try {
    const deletedFlowchart = await Flowchart.findByIdAndDelete(req.params.id);
    if (!deletedFlowchart) return res.status(404).json({ message: "Flowchart not found" });
    res.status(200).json({ message: "Flowchart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete flowchart", error });
  }
};

// Get outgoing edges for a specific flowchart node
exports.getOutgoingEdges = async (req, res) => {
  try {
    const { id, nodeName } = req.params;

    // Find the flowchart by ID
    const flowchart = await Flowchart.findById(id);

    if (!flowchart) {
      return res.status(404).json({
        success: false,
        message: "Flowchart not found",
      });
    }

    // Filter the edges where the "from" node is the given nodeName
    const outgoingEdges = flowchart.edges.filter(
      (edge) => edge.from === nodeName
    );

    res.status(200).json({
      success: true,
      data: outgoingEdges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching outgoing edges",
      error: error.message,
    });
  }
};

// Validate a flowchart (checking for cycles or disconnected nodes)
exports.validateFlowchart = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the flowchart by ID
    const flowchart = await Flowchart.findById(id);

    if (!flowchart) {
      return res.status(404).json({
        success: false,
        message: "Flowchart not found",
      });
    }

    // Function to check if there's a cycle in the flowchart using DFS
    const hasCycle = (edges, visited, node, recursionStack) => {
      if (!visited[node]) {
        visited[node] = true;
        recursionStack[node] = true;

        const outgoingEdges = edges.filter((edge) => edge.from === node);
        for (const edge of outgoingEdges) {
          if (
            !visited[edge.to] &&
            hasCycle(edges, visited, edge.to, recursionStack)
          ) {
            return true;
          }
          if (recursionStack[edge.to]) {
            return true;
          }
        }
      }
      recursionStack[node] = false;
      return false;
    };

    // Check for cycle in the flowchart
    const visited = {};
    const recursionStack = {};
    for (const node of flowchart.nodes) {
      if (hasCycle(flowchart.edges, visited, node, recursionStack)) {
        return res.status(400).json({
          success: false,
          message: "Flowchart has a cycle",
        });
      }
    }

    // Check for disconnected nodes (that are not part of any edge)
    const connectedNodes = new Set();
    for (const edge of flowchart.edges) {
      connectedNodes.add(edge.from);
      connectedNodes.add(edge.to);
    }

    const disconnectedNodes = flowchart.nodes.filter(
      (node) => !connectedNodes.has(node)
    );

    if (disconnectedNodes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Flowchart has disconnected nodes: ${disconnectedNodes.join(", ")}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Flowchart is valid",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error validating flowchart",
      error: error.message,
    });
  }
};

// Add a helper function for traversing the graph
const findConnectedNodes = (node, flowchart) => {
  let connectedNodes = new Set();
  let visited = new Set();

  // Recursive DFS function to traverse nodes
  const dfs = (currentNode) => {
    if (visited.has(currentNode)) return;  // Prevent infinite loops
    visited.add(currentNode);

    // Add current node to connected nodes
    connectedNodes.add(currentNode);

    // Find outgoing edges from the current node
    const outgoingEdges = flowchart.edges.filter(
      (edge) => edge.from === currentNode
    );

    // Visit all nodes connected via outgoing edges
    outgoingEdges.forEach((edge) => {
      dfs(edge.to);
    });
  };

  // Start DFS traversal from the initial node
  dfs(node);

  // Remove the starting node (if it exists in the set)
  connectedNodes.delete(node);

  return Array.from(connectedNodes);
};

// Function to get all connected nodes (directly or indirectly)
exports.getConnectedNodes = async (req, res) => {
  const { id, nodeName } = req.params;

  try {
    // Fetch flowchart by ID
    const flowchart = await Flowchart.findById(id);
    if (!flowchart) {
      return res.status(404).json({ message: "Flowchart not found" });
    }

    // Get all connected nodes
    const connectedNodes = findConnectedNodes(nodeName, flowchart);

    // Return connected nodes as response
    res.status(200).json({
      success: true,
      data: connectedNodes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching connected nodes" });
  }
};


