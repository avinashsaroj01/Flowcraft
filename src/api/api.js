// src/api/api.js
import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Backend base URL
});

// Function to create a flowchart
export const createFlowchart = async (data) => {
  try {
    const response = await API.post("/flowcharts", data);
    return response.data;
  } catch (error) {
    console.error("Error creating flowchart:", error);
    throw error;
  }
};

// Function to fetch a flowchart by ID
export const fetchFlowchartById = async (id) => {
  try {
    const response = await API.get(`/flowcharts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching flowchart:", error);
    throw error;
  }
};

// Add other API functions here (e.g., updateFlowchart, deleteFlowchart)
