const str1 = 'Login Unsuccessful Function - Login UI Element Group';

const str2 = 'Login UI Element Group';

const str3 = 'Delete User Function';

const getCoverStep = (group) => {
  let processedGroup = group;
  if (group.includes('UI Element Group')) {
    if (group.includes(' - ')) processedGroup = group.split(' - ')[1];

    const finalGroup = processedGroup.split(' UI Element Group')[0];
    return `Call '${finalGroup}' UI Element Group`;
  } else if (group.includes('Function')) {
    processedGroup = group.split(' Function')[0];
    return `Call '${processedGroup}' Function`;
  }
  return '';
};

console.log(getCoverStep(str1));
console.log(getCoverStep(str2));
console.log(getCoverStep(str3));
