console.log('inoput inside func area nbs :::::::: ', input)

const TEST_SUITE = [];

const testSuiteObjPN = {};
testSuiteObjPN['TEST_SUITE_NAME'] = 'Page Navigation Test Suite';
testSuiteObjPN['TEST_SUITE_FUNCTIONAL_AREA_UUID'] = input['APP_FUNCTIONAL_AREA_UUID'];
testSuiteObjPN['TEST_SUITE_CREATION_TYPE'] = 'System';
testSuiteObjPN['TEST_SUITE_TYPE'] = 'Page Navigation';
TEST_SUITE.push(testSuiteObjPN);

const testSuiteObjUA = {};
testSuiteObjUA['TEST_SUITE_NAME'] = 'User Action Test Suite';
testSuiteObjUA['TEST_SUITE_FUNCTIONAL_AREA_UUID'] = input['APP_FUNCTIONAL_AREA_UUID'];
testSuiteObjUA['TEST_SUITE_CREATION_TYPE'] = 'System';
testSuiteObjUA['TEST_SUITE_TYPE'] = 'User Action';
TEST_SUITE.push(testSuiteObjUA);


input['AppEngChildEntity:TEST_SUITE'] = TEST_SUITE;