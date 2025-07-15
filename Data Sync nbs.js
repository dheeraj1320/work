if (input.compositeEntityAction == 'Insert' || input.compositeEntityAction == 'Save' || input.compositeEntityAction == 'Activate') {
  input['IS_ACTIVE'] = 'Yes';
}

if (input.compositeEntityAction == 'Deactivate') {
  input['IS_ACTIVE'] = 'No';
}

if (input.compositeEntityAction == 'Insert' || input.compositeEntityAction == 'Save') {
  switch (input.DATA_SYNC_NAME) {
    case 'Prepend Page Name in Page Navigation Test Cases':
      input[
        'DESCRIPTION'
      ] = `{"blocks":[{"key":"8ka8l","text":"This Data Sync will perform the following actions:","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"e0o27","text":"Prepend Page Name in the Test Case for Page Navigation Test Sets, so the Test Case Name for a Page and View will become 'Page Name - View Name' from 'View Name'.","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"qnmj","text":"Create audit records for the Test Cases.","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;
      break;
    case 'Update COMMITTED Page Navigation Test Cases to DRAFT':
      input[
        'DESCRIPTION'
      ] = `{"blocks":[{"key":"8ka8l","text":"This Data Sync will perform the following actions:","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"e0o27","text":"Update Test Case Status for Page Navigation Test Cases to 'DRAFT' from 'COMMITTED'.","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"qnmj","text":"Create audit records for the Test Cases.","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;
      break;
    case 'Update Manual Page Navigation Test Cases to Automated':
      input[
        'DESCRIPTION'
      ] = `{"blocks":[{"key":"8ka8l","text":"This Data Sync will perform the following actions:","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"e0o27","text":"Update Test Case Execution Type for Page Navigation Test Cases to 'Automated' from 'Manual'.","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"qnmj","text":"Create audit records for the Test Cases.","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;
      break;
  }
}
