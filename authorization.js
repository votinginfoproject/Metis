var groupName = function(group) {
  return group.name;
}

var isSuperAdmin = function(user) {
  return user.groups.items.map(groupName).indexOf('Super Admin') !== -1;
}

var isStateGroup = function(group) {
  // State group names are two letters
  return group.name.length === 2;
}

var stateGroups = function(user) {
  return user.groups.items.filter(isStateGroup);
}

var stateGroupNames = function(user) {
  return stateGroups(user).map(groupName);
}

exports.stateGroups = stateGroups;
exports.stateGroupNames = stateGroupNames;
exports.isSuperAdmin = isSuperAdmin;
