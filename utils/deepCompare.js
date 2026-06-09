const diff = require('deep-diff').diff;

function normalizePath(path) {
  return '/' + path.join('/');
}

function isIgnored(path, ignoreFields) {
  if (!ignoreFields || ignoreFields.length === 0) return false;
  const pathStr = normalizePath(path).toLowerCase();
  return ignoreFields.some(f =>
    pathStr.includes(f.toLowerCase()) || path.some(p => p === f)
  );
}

function formatDifferences(lhs, rhs, options = {}) {
  const { ignoreFields = [], ignoreOrder = false } = options;
  const differences = diff(lhs, rhs, (path, key) => {
    return isIgnored([...path, key], ignoreFields);
  });

  if (!differences) return [];

  return differences.map(d => {
    const path = normalizePath(d.path);
    const base = { path, kind: d.kind };

    switch (d.kind) {
      case 'E':
        return { ...base, type: 'changed', old: d.lhs, new: d.rhs };
      case 'N':
        return { ...base, type: 'added', new: d.rhs };
      case 'D':
        return { ...base, type: 'removed', old: d.lhs };
      case 'A':
        return {
          ...base,
          type: 'array_change',
          index: d.item.path ? d.item.path[0] : undefined,
          change: {
            kind: d.item.kind,
            old: d.item.lhs,
            new: d.item.rhs,
          },
        };
      default:
        return base;
    }
  });
}

function compareAll(api1Response, api2Response, options = {}) {
  const differences = [];

  differences.push(...formatDifferences(
    { status: api1Response.status, body: api1Response.body },
    { status: api2Response.status, body: api2Response.body },
    options
  ));

  const summary = {
    totalDiffs: differences.length,
    statusMatch: api1Response.status === api2Response.status,
    bodyMatch: differences.length === 0,
  };

  const equal = differences.length === 0;

  return { equal, differences, summary };
}

module.exports = { compareAll, formatDifferences };
