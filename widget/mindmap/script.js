// Interactive Node Graph Editor
let nodes = new vis.DataSet([
    { id: 1, label: 'Apple', group: 'Person', comment: '', x: 0, y: 0 },
    { id: 2, label: 'Banana', group: 'Person', comment: '', x: -200, y: -50 },
    { id: 3, label: 'Catepillar', group: 'Person', comment: '', x: -200, y: 150 },
]);

let edges = new vis.DataSet([
    { from: 1, to: 2 },
    { from: 1, to: 3 },
]);

// Global variables
let network;
let nodeIdCounter = 10; // Start from 10 to avoid conflicts with existing nodes
let currentMode = 'edit';
let physicsEnabled = false;
let selectedNodeForEdge = null;
let editingNodeId = null;

// Group visibility tracking - all groups are visible by default
let groupVisibility = {};

// Dynamic groups management
let customGroups = {
    A: { name: 'Project', color: { background: '#93B5C6', border: '#5A8AAA' } },
    B: { name: 'Type', color: { background: '#F0CF65', border: '#D4B943' } },
    C: { name: 'Person', color: { background: '#D7816A', border: '#C16648' } },
};

// Network options
function getNetworkOptions() {
    return {
        nodes: {
            shape: 'dot',
            size: 16,
            font: {
                size: 14,
                color: '#000'
            },
            borderWidth: 2,
            shadow: true
        },
        edges: {
            width: 2,
            color: '#999',
            shadow: true,
            smooth: {
                type: 'continuous'
            }
        },
        groups: customGroups,
        interaction: {
            hover: true,
            selectConnectedEdges: false,
            multiselect: true
        },
        physics: {
            enabled: physicsEnabled,
            stabilization: false
        },
        manipulation: {
            enabled: false
        }
    };
}

// Initialize the network
function initNetwork() {
    const container = document.getElementById('network');
    const data = { nodes, edges };
    network = new vis.Network(container, data, getNetworkOptions());
    
    // Set up event listeners
    setupEventListeners();
    
    // Update UI
    updateGroupsDisplay();
    updateNodeGroupOptions();
    
    // Set initial mode
    setMode('edit');
}

// Set up all event listeners
function setupEventListeners() {
    // Double click to add nodes or edit
    network.on('doubleClick', function(params) {
        hideNodeTooltip(); // Hide tooltip when double-clicking
        if (currentMode === 'addNode') {
            addNode(params.pointer.canvas.x, params.pointer.canvas.y);
        } else if (currentMode === 'edit' && params.nodes.length > 0) {
            editNode(params.nodes[0]);
        }
    });
    
    // Single click for edge creation or showing comments
    network.on('click', function(params) {
        if (currentMode === 'addEdge' && params.nodes.length > 0) {
            hideNodeTooltip(); // Hide tooltip when in edge mode
            handleEdgeCreation(params.nodes[0]);
        } else if (params.nodes.length > 0) {
            // Show comment tooltip for single clicks on nodes
            showNodeTooltip(params.nodes[0], params.pointer.DOM);
        } else {
            // Hide tooltip when clicking empty space
            hideNodeTooltip();
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Delete') {
            deleteSelected();
        } else if (event.key === 'Escape') {
            selectedNodeForEdge = null;
            updateSelectedNodeHighlight();
            hideNodeTooltip();
        }
    });
    
    // Hide tooltip when clicking outside the network
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#network') && !event.target.closest('#nodeTooltip')) {
            hideNodeTooltip();
        }
    });
    
    // Hover effects
    network.on('hoverNode', function(params) {
        const nodeId = params.node;
        const node = nodes.get(nodeId);
        document.getElementById('network').title = `Group: ${node.group}`;
    });
    
    network.on('blurNode', function() {
        document.getElementById('network').title = '';
    });
}

// Add a new node at the specified coordinates
function addNode(x, y) {
    const label = prompt('Enter a name for the new node:', `Node ${nodeIdCounter}`);
    
    // If user cancels or enters empty string, don't create the node
    if (label === null || label.trim() === '') {
        return;
    }
    
    // Create a group selection dialog
    const groupOptions = Object.keys(customGroups).map(groupId => {
        return `${groupId}: ${customGroups[groupId].name}`;
    }).join('\n');
    
    const groupPrompt = `Choose a group for "${label.trim()}":\n\n${groupOptions}\n\nEnter the group ID (letter):`;
    let selectedGroup = prompt(groupPrompt, 'A');
    
    // If user cancels group selection, don't create the node
    if (selectedGroup === null) {
        return;
    }
    
    // Validate the selected group, default to 'C' if invalid
    if (!customGroups[selectedGroup]) {
        alert(`Invalid group "${selectedGroup}". Using default group "Person" instead.`);
        selectedGroup = 'A';
    }
    
    // Ask for a comment/description
    const comment = prompt(`Enter a comment or description for "${label.trim()}" (optional):`, '');
    
    const newNode = {
        id: nodeIdCounter++,
        label: label.trim(),
        group: selectedGroup,
        comment: comment || '',
        x: x,
        y: y
    };
    
    nodes.add(newNode);
    console.log('Added node:', newNode);
}

// Edit an existing node
function editNode(nodeId) {
    const node = nodes.get(nodeId);
    if (!node) return;
    
    editingNodeId = nodeId;
    document.getElementById('nodeLabel').value = node.label;
    document.getElementById('nodeGroup').value = node.group;
    document.getElementById('nodeComment').value = node.comment || '';
    document.getElementById('nodeModal').style.display = 'block';
}

// Save node edits
function saveNodeEdit() {
    if (editingNodeId === null) return;
    
    const label = document.getElementById('nodeLabel').value.trim();
    const group = document.getElementById('nodeGroup').value;
    const comment = document.getElementById('nodeComment').value.trim();
    
    if (label === '') {
        alert('Please enter a label for the node');
        return;
    }
    
    nodes.update({
        id: editingNodeId,
        label: label,
        group: group,
        comment: comment
    });
    
    closeModal();
    console.log('Updated node:', editingNodeId);
}

// Close the modal
function closeModal() {
    document.getElementById('nodeModal').style.display = 'none';
    editingNodeId = null;
}

// Delete the currently edited node
function deleteCurrentNode() {
    if (editingNodeId === null) return;
    
    if (confirm('Are you sure you want to delete this node? This will also delete all connected edges.')) {
        // Delete all edges connected to this node
        const connectedEdges = edges.get().filter(edge => 
            edge.from === editingNodeId || edge.to === editingNodeId
        );
        edges.remove(connectedEdges.map(edge => edge.id));
        
        // Delete the node
        nodes.remove(editingNodeId);
        
        console.log('Deleted node:', editingNodeId);
        closeModal();
    }
}

// Show tooltip with node comment
function showNodeTooltip(nodeId, mousePosition) {
    const node = nodes.get(nodeId);
    if (!node) return;
    
    const tooltip = document.getElementById('nodeTooltip');
    const titleElement = document.getElementById('tooltipTitle');
    const commentElement = document.getElementById('tooltipComment');
    
    // Set tooltip content
    titleElement.textContent = node.label;
    
    if (node.comment && node.comment.trim() !== '') {
        commentElement.textContent = node.comment;
        commentElement.style.display = 'block';
    } else {
        commentElement.textContent = 'No comment available';
        commentElement.style.display = 'block';
        commentElement.style.fontStyle = 'italic';
        commentElement.style.opacity = '0.7';
    }
    
    // Position tooltip near the mouse cursor
    tooltip.style.left = (mousePosition.x + 10) + 'px';
    tooltip.style.top = (mousePosition.y - 10) + 'px';
    tooltip.style.display = 'block';
    
    // Auto-hide after 5 seconds
    clearTimeout(tooltip.hideTimeout);
    tooltip.hideTimeout = setTimeout(hideNodeTooltip, 5000);
}

// Hide tooltip
function hideNodeTooltip() {
    const tooltip = document.getElementById('nodeTooltip');
    tooltip.style.display = 'none';
    clearTimeout(tooltip.hideTimeout);
}

// Handle edge creation
function handleEdgeCreation(nodeId) {
    if (selectedNodeForEdge === null) {
        // First node selected
        selectedNodeForEdge = nodeId;
        updateSelectedNodeHighlight();
    } else if (selectedNodeForEdge === nodeId) {
        // Same node clicked, deselect
        selectedNodeForEdge = null;
        updateSelectedNodeHighlight();
    } else {
        // Second node selected, create edge
        const edgeId = `${selectedNodeForEdge}_${nodeId}`;
        
        // Check if edge already exists
        const existingEdge = edges.get().find(edge => 
            (edge.from === selectedNodeForEdge && edge.to === nodeId) ||
            (edge.from === nodeId && edge.to === selectedNodeForEdge)
        );
        
        if (!existingEdge) {
            edges.add({
                id: edgeId,
                from: selectedNodeForEdge,
                to: nodeId
            });
            console.log('Added edge:', selectedNodeForEdge, 'to', nodeId);
        } else {
            alert('Edge already exists between these nodes');
        }
        
        selectedNodeForEdge = null;
        updateSelectedNodeHighlight();
    }
}

// Update visual highlight for selected node in edge mode
function updateSelectedNodeHighlight() {
    if (selectedNodeForEdge !== null) {
        network.selectNodes([selectedNodeForEdge]);
    } else {
        network.unselectAll();
    }
}

// Delete selected edges only (nodes can only be deleted through edit modal)
function deleteSelected() {
    const selectedNodes = network.getSelectedNodes();
    const selectedEdges = network.getSelectedEdges();
    
    // Only delete edges, not nodes (too dangerous for accidental deletion)
    if (selectedNodes.length > 0) {
        console.log('Nodes cannot be deleted with Delete key. Use Edit mode and double-click the node to delete.');
        alert('For safety, nodes cannot be deleted with the Delete key.\nTo delete a node: Switch to Edit/Move mode, double-click the node, then click Delete in the modal.');
    }
    
    if (selectedEdges.length > 0) {
        edges.remove(selectedEdges);
        console.log('Deleted edges:', selectedEdges);
    }
}

// Set the current mode
function setMode(mode) {
    currentMode = mode;
    selectedNodeForEdge = null;
    
    // Update button styles
    document.querySelectorAll('.mode-btn').forEach(btn => btn.style.background = '#505050');
    
    switch(mode) {
        case 'addNode':
            document.getElementById('addNodeBtn').style.background = '#777777';
            document.getElementById('network').style.cursor = 'crosshair';
            break;
        case 'addEdge':
            document.getElementById('addEdgeBtn').style.background = '#777777';
            document.getElementById('network').style.cursor = 'pointer';
            break;
        case 'edit':
            document.getElementById('editBtn').style.background = '#777777';
            document.getElementById('network').style.cursor = 'default';
            break;
    }
    
    console.log('Mode changed to:', mode);
}

// Toggle physics simulation
function togglePhysics() {
    physicsEnabled = !physicsEnabled;
    network.setOptions({ physics: { enabled: physicsEnabled } });
    
    const button = document.getElementById('physicsButton');
    button.textContent = physicsEnabled ? 'Disable Physics' : 'Enable Physics';
    
    console.log('Physics:', physicsEnabled ? 'enabled' : 'disabled');
}

// Clear all nodes and edges
function clearGraph() {
    if (confirm('Are you sure you want to clear the entire graph?')) {
        nodes.clear();
        edges.clear();
        nodeIdCounter = 1;
        console.log('Graph cleared');
    }
}

// Export graph data as JSON
function exportGraph() {
    const graphData = {
        nodes: nodes.get(),
        edges: edges.get(),
        nodeIdCounter: nodeIdCounter
    };
    
    const dataStr = JSON.stringify(graphData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'network-graph.json';
    link.click();
    
    console.log('Graph exported');
}

// Import graph data from JSON file
function importGraph(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const graphData = JSON.parse(e.target.result);
            
            // Clear current graph
            nodes.clear();
            edges.clear();
            
            // Load new data
            nodes.add(graphData.nodes);
            edges.add(graphData.edges);
            nodeIdCounter = graphData.nodeIdCounter || 1;
            
            console.log('Graph imported successfully');
        } catch (error) {
            alert('Error importing graph: Invalid JSON file');
            console.error('Import error:', error);
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Clear the input
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initNetwork();
    
    // Close modals when clicking outside of them
    window.onclick = function(event) {
        const nodeModal = document.getElementById('nodeModal');
        const groupModal = document.getElementById('groupModal');
        
        if (event.target === nodeModal) {
            closeModal();
        } else if (event.target === groupModal) {
            closeGroupModal();
        }
    };
});

// Auto-save functionality (saves to localStorage every 30 seconds)
setInterval(function() {
    const graphData = {
        nodes: nodes.get(),
        edges: edges.get(),
        nodeIdCounter: nodeIdCounter,
        customGroups: customGroups,
        groupVisibility: groupVisibility
    };
    localStorage.setItem('networkGraphAutoSave', JSON.stringify(graphData));
}, 30000);

// Load auto-saved data on startup
window.addEventListener('load', function() {
    const autoSaved = localStorage.getItem('networkGraphAutoSave');
    if (autoSaved && confirm('Found auto-saved data. Would you like to restore it?')) {
        try {
            const graphData = JSON.parse(autoSaved);
            nodes.clear();
            edges.clear();
            nodes.add(graphData.nodes);
            edges.add(graphData.edges);
            nodeIdCounter = graphData.nodeIdCounter || 1;
            
            // Restore custom groups if available
            if (graphData.customGroups) {
                customGroups = graphData.customGroups;
                network.setOptions(getNetworkOptions());
                updateGroupsDisplay();
                updateNodeGroupOptions();
            }
            
            // Restore group visibility if available
            if (graphData.groupVisibility) {
                groupVisibility = graphData.groupVisibility;
                // Apply visibility states
                Object.keys(groupVisibility).forEach(groupId => {
                    if (!groupVisibility[groupId]) {
                        const groupNodes = nodes.get().filter(node => node.group === groupId);
                        groupNodes.forEach(node => {
                            nodes.update({ id: node.id, hidden: true });
                        });
                    }
                });
                updateGroupsDisplay();
            }
            
            console.log('Auto-saved data restored');
        } catch (error) {
            console.error('Error restoring auto-saved data:', error);
        }
    }
});

// Group Management Functions

// Open the group management modal
function openGroupManager() {
    updateExistingGroupsList();
    document.getElementById('groupModal').style.display = 'block';
}

// Close the group management modal
function closeGroupModal() {
    document.getElementById('groupModal').style.display = 'none';
    // Clear form
    document.getElementById('newGroupId').value = '';
    document.getElementById('newGroupName').value = '';
    document.getElementById('newGroupBgColor').value = '#93B5C6';
    document.getElementById('newGroupBorderColor').value = '#5A8AAA';
}

// Add a new group
function addNewGroup() {
    const groupId = document.getElementById('newGroupId').value.trim();
    const groupName = document.getElementById('newGroupName').value.trim();
    const bgColor = document.getElementById('newGroupBgColor').value;
    const borderColor = document.getElementById('newGroupBorderColor').value;
    
    if (!groupId || !groupName) {
        alert('Please enter both Group ID and Group Name');
        return;
    }
    
    // Check if group ID already exists
    if (customGroups[groupId]) {
        alert('Group ID already exists. Please choose a different ID.');
        return;
    }
    
    // Add the new group
    customGroups[groupId] = {
        name: groupName,
        color: {
            background: bgColor,
            border: borderColor
        }
    };
    
    // Initialize visibility for new group
    groupVisibility[groupId] = true;
    
    // Update the network with new groups
    network.setOptions(getNetworkOptions());
    
    // Update UI
    updateGroupsDisplay();
    updateNodeGroupOptions();
    updateExistingGroupsList();
    
    // Clear form
    document.getElementById('newGroupId').value = '';
    document.getElementById('newGroupName').value = '';
    
    console.log('Added new group:', groupId, customGroups[groupId]);
}

// Delete a group
function deleteGroup(groupId) {
    if (confirm(`Are you sure you want to delete the group "${customGroups[groupId].name}"?\n\nNodes in this group will be moved to the "C" group.`)) {
        // Show any hidden nodes in this group before moving them
        if (!groupVisibility[groupId]) {
            toggleGroupVisibility(groupId);
        }
        
        // Move all nodes from this group to 'C'
        const nodesToUpdate = nodes.get().filter(node => node.group === groupId);
        nodesToUpdate.forEach(node => {
            nodes.update({ id: node.id, group: 'C' });
        });
        
        // Delete the group and its visibility tracking
        delete customGroups[groupId];
        delete groupVisibility[groupId];
        
        // Update the network
        network.setOptions(getNetworkOptions());
        
        // Update UI
        updateGroupsDisplay();
        updateNodeGroupOptions();
        updateExistingGroupsList();
        
        console.log('Deleted group:', groupId);
    }
}

// Edit a group's colors
function editGroup(groupId) {
    const group = customGroups[groupId];
    const newName = prompt('Enter new name for the group:', group.name);
    if (newName === null) return; // User cancelled
    
    const newBgColor = prompt('Enter background color (hex):', group.color.background);
    if (newBgColor === null) return;
    
    const newBorderColor = prompt('Enter border color (hex):', group.color.border);
    if (newBorderColor === null) return;
    
    // Update the group
    customGroups[groupId].name = newName || group.name;
    customGroups[groupId].color.background = newBgColor || group.color.background;
    customGroups[groupId].color.border = newBorderColor || group.color.border;
    
    // Update the network
    network.setOptions(getNetworkOptions());
    
    // Update UI
    updateGroupsDisplay();
    updateNodeGroupOptions();
    updateExistingGroupsList();
    
    console.log('Updated group:', groupId, customGroups[groupId]);
}

// Update the groups display in the main interface
function updateGroupsDisplay() {
    const display = document.getElementById('groupsDisplay');
    display.innerHTML = '';
    
    Object.keys(customGroups).forEach(groupId => {
        const group = customGroups[groupId];
        
        // Initialize visibility if not set
        if (groupVisibility[groupId] === undefined) {
            groupVisibility[groupId] = true;
        }
        
        const groupElement = document.createElement('button');
        groupElement.className = 'groups-display-item';
        groupElement.style.backgroundColor = group.color.background;
        groupElement.style.borderColor = group.color.border;
        groupElement.style.color = getContrastColor(group.color.background);
        groupElement.textContent = group.name;
        
        // Add visual indicator for visibility state
        if (!groupVisibility[groupId]) {
            groupElement.style.opacity = '0.5';
            groupElement.style.textDecoration = 'line-through';
            groupElement.title = `${group.name} (Hidden) - Click to show`;
        } else {
            groupElement.style.opacity = '1';
            groupElement.style.textDecoration = 'none';
            groupElement.title = `${group.name} (Visible) - Click to hide`;
        }
        
        // Add click handler to toggle visibility
        groupElement.onclick = () => toggleGroupVisibility(groupId);
        
        display.appendChild(groupElement);
    });
}

// Toggle visibility of all nodes in a group
function toggleGroupVisibility(groupId) {
    // Toggle the visibility state
    groupVisibility[groupId] = !groupVisibility[groupId];
    
    // Get all nodes in this group
    const groupNodes = nodes.get().filter(node => node.group === groupId);
    
    if (groupVisibility[groupId]) {
        // Show nodes: explicitly set hidden to false
        groupNodes.forEach(node => {
            nodes.update({ id: node.id, hidden: false });
        });
        console.log(`Showing group "${customGroups[groupId].name}"`);
    } else {
        // Hide nodes: set hidden property to true
        groupNodes.forEach(node => {
            nodes.update({ id: node.id, hidden: true });
        });
        console.log(`Hiding group "${customGroups[groupId].name}"`);
    }
    
    // Update the display to show new state
    updateGroupsDisplay();
}

// Update the node group options in the edit modal
function updateNodeGroupOptions() {
    const select = document.getElementById('nodeGroup');
    select.innerHTML = '';
    
    Object.keys(customGroups).forEach(groupId => {
        const option = document.createElement('option');
        option.value = groupId;
        option.textContent = customGroups[groupId].name;
        select.appendChild(option);
    });
}

// Update the existing groups list in the group management modal
function updateExistingGroupsList() {
    const container = document.getElementById('existingGroups');
    container.innerHTML = '';
    
    Object.keys(customGroups).forEach(groupId => {
        const group = customGroups[groupId];
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group-item';
        
        groupDiv.innerHTML = `
            <div class="group-color-preview" style="background-color: ${group.color.background}; border-color: ${group.color.border};"></div>
            <div class="group-info">
                <strong>${group.name}</strong><br>
                <small>ID: ${groupId} | BG: ${group.color.background} | Border: ${group.color.border}</small>
            </div>
            <div class="group-actions">
                <button onclick="editGroup('${groupId}')" title="Edit group">Edit</button>
                <button onclick="deleteGroup('${groupId}')" class="delete" title="Delete group">Delete</button>
            </div>
        `;
        
        container.appendChild(groupDiv);
    });
}

// Helper function to get contrast color for text
function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

// Update export/import to include custom groups
const originalExportGraph = exportGraph;
function exportGraph() {
    const graphData = {
        nodes: nodes.get(),
        edges: edges.get(),
        nodeIdCounter: nodeIdCounter,
        customGroups: customGroups
    };
    
    const dataStr = JSON.stringify(graphData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'network-graph.json';
    link.click();
    
    console.log('Graph exported with custom groups');
}

// Export graph as standalone HTML file
function exportHTML() {
    const graphData = {
        nodes: nodes.get(),
        edges: edges.get(),
        customGroups: customGroups
    };
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Network Graph</title>
    <link rel="stylesheet" href="https://unpkg.com/vis-network/styles/vis-network.min.css">
    <script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10px;
            height: 100vh;
            display: grid;
            grid-template-rows: auto auto auto 1fr auto;
            grid-gap: 10px;
            box-sizing: border-box;
            background-color: #f9f9f9;
        }
        
        h1 {
            margin: 0 0 10px 0;
            text-align: center;
            color: #333;
        }
        
        .controls {
            margin: 0;
            padding: 8px;
            background: #f5f5f5;
            border-radius: 5px;
        }
        
        .control-group {
            margin: 5px 0;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 5px;
            justify-content: center;
        }
        
        .control-group button {
            white-space: nowrap;
        }
        
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 0 5px;
        }
        
        button:hover {
            background: #45a049;
        }
        
        #network {
            width: 100%;
            height: 100%;
            min-height: 400px;
            border: 1px solid lightgray;
            border-radius: 5px;
            background-color: white;
        }
        
        .info {
            margin: 0;
            padding: 10px;
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            border-radius: 0 5px 5px 0;
            text-align: center;
            font-size: 14px;
            color: #333;
        }
        
        .groups-display {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin: 5px 0;
        }
        
        .groups-display-item {
            display: inline-block;
            margin: 2px 5px;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            color: white;
            border: 2px solid;
            font-weight: bold;
        }
        
        /* Responsive design adjustments */
        @media (max-height: 600px) {
            body {
                padding: 5px;
                grid-gap: 5px;
            }
            
            .controls {
                padding: 5px;
            }
            
            .info {
                padding: 8px;
            }
            
            #network {
                min-height: 300px;
            }
        }
        
        @media (max-width: 768px) {
            .control-group {
                flex-direction: column;
                align-items: stretch;
            }
            
            .control-group button {
                margin: 2px 0;
            }
        }
    </style>
</head>
<body>
    <h1>Network Graph Visualization</h1>
    
    <div class="controls">
        <div class="control-group">
            <button onclick="togglePhysics()" id="physicsButton">Enable Physics</button>
            <button onclick="fitNetwork()">Fit to Screen</button>
            <button onclick="resetZoom()">Reset Zoom</button>
        </div>
    </div>
    
    <div class="controls">
        <div class="groups-display" id="groupsDisplay">
            <!-- Groups will be displayed here -->
        </div>
    </div>
    
    <div id="network"></div>
    
    <div class="info">
        <p><strong>Interactive Network Graph</strong></p>
        <p>Drag nodes to move • Zoom with mouse wheel • Pan by dragging empty space</p>
        <p>Total Nodes: <span id="nodeCount">${graphData.nodes.length}</span> | Total Edges: <span id="edgeCount">${graphData.edges.length}</span></p>
    </div>

    <script>
        // Graph data
        const graphData = ${JSON.stringify(graphData, null, 8)};
        
        // Initialize vis.js datasets
        const nodes = new vis.DataSet(graphData.nodes);
        const edges = new vis.DataSet(graphData.edges);
        let network;
        let physicsEnabled = false;
        
        // Network options
        function getNetworkOptions() {
            return {
                nodes: {
                    shape: 'dot',
                    size: 16,
                    font: {
                        size: 14,
                        color: '#000'
                    },
                    borderWidth: 2,
                    shadow: true
                },
                edges: {
                    width: 2,
                    color: '#999',
                    shadow: true,
                    smooth: {
                        type: 'continuous'
                    }
                },
                groups: graphData.customGroups,
                interaction: {
                    hover: true,
                    selectConnectedEdges: false,
                    multiselect: true
                },
                physics: {
                    enabled: physicsEnabled,
                    stabilization: false
                },
                manipulation: {
                    enabled: false
                }
            };
        }
        
        // Initialize the network
        function initNetwork() {
            const container = document.getElementById('network');
            const data = { nodes, edges };
            network = new vis.Network(container, data, getNetworkOptions());
            
            // Update groups display
            updateGroupsDisplay();
            
            // Hover effects
            network.on('hoverNode', function(params) {
                const nodeId = params.node;
                const node = nodes.get(nodeId);
                const group = graphData.customGroups[node.group];
                const groupName = group ? group.name : node.group;
                document.getElementById('network').title = \`Node: \${node.label}\\nGroup: \${groupName}\`;
            });
            
            network.on('blurNode', function() {
                document.getElementById('network').title = '';
            });
        }
        
        // Toggle physics simulation
        function togglePhysics() {
            physicsEnabled = !physicsEnabled;
            network.setOptions({ physics: { enabled: physicsEnabled } });
            
            const button = document.getElementById('physicsButton');
            button.textContent = physicsEnabled ? 'Disable Physics' : 'Enable Physics';
        }
        
        // Fit network to screen
        function fitNetwork() {
            network.fit();
        }
        
        // Reset zoom
        function resetZoom() {
            network.moveTo({
                position: {x: 0, y: 0},
                scale: 1
            });
        }
        
        // Update the groups display
        function updateGroupsDisplay() {
            const display = document.getElementById('groupsDisplay');
            display.innerHTML = '';
            
            Object.keys(graphData.customGroups).forEach(groupId => {
                const group = graphData.customGroups[groupId];
                const groupElement = document.createElement('span');
                groupElement.className = 'groups-display-item';
                groupElement.style.backgroundColor = group.color.background;
                groupElement.style.borderColor = group.color.border;
                groupElement.style.color = getContrastColor(group.color.background);
                groupElement.textContent = group.name;
                display.appendChild(groupElement);
            });
        }
        
        // Helper function to get contrast color for text
        function getContrastColor(hexColor) {
            const r = parseInt(hexColor.substr(1, 2), 16);
            const g = parseInt(hexColor.substr(3, 2), 16);
            const b = parseInt(hexColor.substr(5, 2), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? '#000000' : '#ffffff';
        }
        
        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initNetwork();
        });
    </script>
</body>
</html>`;
    
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(htmlBlob);
    link.download = 'network-graph.html';
    link.click();
    
    console.log('Graph exported as HTML');
}

// Update import to handle custom groups
const originalImportGraph = importGraph;
function importGraph(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const graphData = JSON.parse(e.target.result);
            
            // Clear current graph
            nodes.clear();
            edges.clear();
            
            // Load new data
            nodes.add(graphData.nodes);
            edges.add(graphData.edges);
            nodeIdCounter = graphData.nodeIdCounter || 1;
            
            // Load custom groups if available
            if (graphData.customGroups) {
                customGroups = graphData.customGroups;
                network.setOptions(getNetworkOptions());
                updateGroupsDisplay();
                updateNodeGroupOptions();
            }
            
            console.log('Graph imported successfully with custom groups');
        } catch (error) {
            alert('Error importing graph: Invalid JSON file');
            console.error('Import error:', error);
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Clear the input
}

function toggleInstructions() {
    const instructions = document.querySelector('.instructions');
    instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
}