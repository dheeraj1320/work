function formatDataToArray(nodes, parentKey = null, depth = 0, result = []) {
  debugger;
nodes.forEach((node) => {
  
  if (node.parentNodeID === parentKey) {
    result.push(' '.repeat(depth) + node.title);
    debugger;
    if (node.children && node.children.length > 0) {
      formatDataToArray(node.children, node.primaryKey, depth + 1, result);
    }
  } else if (!node.parentNodeID) {
    result.push(' '.repeat(depth) + node.title);
    debugger;
    if (node.children && node.children.length > 0) {
      formatDataToArray(node.children, node.primaryKey, depth + 1, result);
    }
  }
});
return result;
}