try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  console.log('input[0]:::::', input[0]);
  msg.payload.result = {};
  msg.payload.result.errors = [];
  let err_obj = {};
  let errorData = [];
  function executeValidation(field_name, val_location) {
    console.log(field_name, val_location, 'field_name::::::');
    if (field_name != null) {
      let phone_number = field_name;
      let resultPattern = '[^+0-9a-zA-Z]+';
      let resultPatternRegEx = new RegExp(resultPattern);
      let result = phone_number.replace(resultPatternRegEx, '');
      let mobilePattern = '^[+]91{1}|[+]1{1}';
      let mobilePatternRegEx = new RegExp(mobilePattern);
      let mobile = result.replace(mobilePatternRegEx, '');
      mobile = mobile.replace(/[&@/#, +()$~%.':*?<>{}]/g, '');
      console.log(mobile, 'mobile number:::');
      let pattern = '^(?!0+$)[0-9]{10}$';
      let patternRegEx = new RegExp(pattern);
      let checkpattern = patternRegEx.test(mobile);
      console.log(checkpattern, 'checkpattern::::');
      if (checkpattern == false) {
        console.log('Validation failed>>>>');
        msg.payload.result.mode = 'Enable Message';
        msg.payload.result.code = 406;
        err_obj = { message: 'Invalid Phone Number. Enter 10 Digit Phone Number Without Special Characters.', reason: 'Message below form field', warningMessage: '', location: val_location };
        errorData.push(err_obj);
        console.log(errorData, 'errorss');
      }
      if (errorData.length > 0) {
        console.log('has error');
        msg.payload.result.errors = errorData;
        msg.payload['isErrorCheck'] = true;
      } else {
        msg.payload['isErrorCheck'] = false;
      }
    } else {
      msg.payload['isErrorCheck'] = false;
    }
    return msg;
  }
  if (input[0].CND_PRIM_PH_NUM != null) {
    let msg = executeValidation(input[0].CND_PRIM_PH_NUM, 'bc06b4fb-a616-4b86-9a40-a71424e980a6=>0=>CND_PRIM_PH_NUM');
  }
  if (input[0].CND_SCNDRY_PH_NUM != null) {
    let msg = executeValidation(input[0].CND_SCNDRY_PH_NUM, 'bc06b4fb-a616-4b86-9a40-a71424e980a6=>0=>CND_SCNDRY_PH_NUM');
  }
  if (input[0].CONTACT_NO != null) {
    let val_location = '';
    if (input[0].hasOwnProperty('CLIENT_NAME')) {
      val_location = '4183724a-3c8e-442d-8628-425db0093cd4=>0=>CONTACT_NO';
    } else if (input[0].hasOwnProperty('VENDOR_NAME')) {
      val_location = 'e9739322-79fd-4017-b778-6171c98ec2eb=>0=>CONTACT_NO';
    } else if (input[0].hasOwnProperty('END_CLIENT_NAME')) {
      val_location = '151011b7-b3b1-4ef4-94be-fee2a8860fa7=>0=>CONTACT_NO';
    }
    let msg = executeValidation(input[0].CONTACT_NO, val_location);
  }
  if (input[0].OFFICE_NO != null) {
    let val_location = '';
    console.log(input[0].hasOwnProperty('CLIENT_NAME'), ':::::::>>>>>>>');
    if (input[0].hasOwnProperty('CLIENT_NAME')) {
      console.log('Inside client form::::::');
      val_location = '4183724a-3c8e-442d-8628-425db0093cd4=>0=>OFFICE_NO';
    } else if (input[0].hasOwnProperty('END_CLIENT_NAME')) {
      val_location = '151011b7-b3b1-4ef4-94be-fee2a8860fa7=>0=>OFFICE_NO';
    }
    let msg = executeValidation(input[0].OFFICE_NO, val_location);
  }
  if (input[0].EMPLOYER_PHONE_NUMBER != null) {
    let val_location = '';
    if (!input[0].hasOwnProperty('CND_NM_TX')) {
      console.log('Inside employer form::::::');
      val_location = '61bbb244-4d48-4f29-8116-aaaf47b1df62=>0=>EMPLOYER_PHONE_NUMBER';
    } else if (input[0].hasOwnProperty('CND_NM_TX')) {
      val_location = 'bc06b4fb-a616-4b86-9a40-a71424e980a6=>0=>EMPLOYER_PHONE_NUMBER';
    }
    let msg = executeValidation(input[0].EMPLOYER_PHONE_NUMBER, val_location);
  }
  if (input[0].OFFICE_NUM != null) {
    let msg = executeValidation(input[0].OFFICE_NUM, 'e9739322-79fd-4017-b778-6171c98ec2eb=>0=>OFFICE_NUM');
  }
  if (input[0].MOB_NO != null) {
    let msg = executeValidation(input[0].MOB_NO, '151011b7-b3b1-4ef4-94be-fee2a8860fa7=>0=>MOB_NO');
  }
  if (!input[0].CND_PRIM_PH_NUM && !input[0].CND_SCNDRY_PH_NUM && !input[0].CONTACT_NO && !input[0].OFFICE_NO && !input[0].EMPLOYER_PHONE_NUMBER && !input[0].VND_MOBILE_NO && !input[0].MOB_NO) {
    msg.payload['isErrorCheck'] = false;
  }
  console.log('phn node', msg.payload['isErrorCheck']);
  node.send(msg);
} catch (t) {
  console.log('Errorr Occured', t.message);
  return;
}

// -----------------------------------
// -----------------------------------
// -----------------------------------

const AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
const input = msg.payload.apiRequestBody.baseEntity.records;
const InputChild = msg.payload.apiRequestBody.baseEntity.childEntities[0].records[0];
if (input[0].PAGENAME_KEY == 'CANDIDATE' && !input[0].CANDIDATE_ID) {
  if (
    InputChild.ENGAGEMENT_TYPE == 'Corp-To-Corp(Employer and Vendor Different)' &&
    ((!input[0]['EMPLOYER_UUID'] && !input[0]['VENDOR_UUID']) || (input[0]['EMPLOYER_UUID'] && !input[0]['VENDOR_UUID']) || (!input[0]['EMPLOYER_UUID'] && input[0]['VENDOR_UUID']))
  ) {
    msg.payload['isErrorCheck'] = true;
    msg.payload.result = { mode: 'Enable Message', code: 406, errors: [] };
    msg.payload.result.errors.push({
      message: 'Please add Employer and Vendor from Personal Details tab.',
      reason: 'Message below form field',
      warningMessage: '',
      location: 'bc06b4fb-a616-4b86-9a40-a71424e980a6=>0=>bda05374-749f-45ab-a39c-b714a692e381=>0=>ENGAGEMENT_TYPE'
    });
  } else if (InputChild.ENGAGEMENT_TYPE == 'Corp-To-Corp(Employer and Vendor Same)' && !input[0]['EMPLOYER_UUID']) {
    msg.payload['isErrorCheck'] = true;
    msg.payload.result = { mode: 'Enable Message', code: 406, errors: [] };
    msg.payload.result.errors.push({
      message: 'Please add Employer from Personal Details tab.',
      reason: 'Message below form field',
      warningMessage: '',
      location: 'bc06b4fb-a616-4b86-9a40-a71424e980a6=>0=>bda05374-749f-45ab-a39c-b714a692e381=>0=>ENGAGEMENT_TYPE'
    });
  } else {
    msg.payload['isErrorCheck'] = false;
  }
} else {
  msg.payload['isErrorCheck'] = false;
}
node.send(msg);

// -----------------------------------
// -----------------------------------
// -----------------------------------

const AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
const input = msg.payload.apiRequestBody.baseEntity.records[0];
console.log('eml 2********************');
if (input.CND_EMAIL_ID || input.CND_LNKDN_ID) {
  msg.payload['isErrorCheck'] = false;
} else {
  msg.payload['isErrorCheck'] = true;
  msg.payload.result = { code: 406, errors: [] };
  msg.payload.result.errors.push(
    { message: `Please add Email ID or LinkedIn ID.`, location: 'bc06b4fb-a616-4b86-9a40-a71424e980a6=>0' },
    { message: 'Is Required.', reason: 'Message below form field', warningMessage: '', location: 'bc06b4fb-a616-4b86-9a40-a71424e980a6=>0=>CND_EMAIL_ID' },
    { message: 'Is Required.', reason: 'Message below form field', warningMessage: '', location: 'bc06b4fb-a616-4b86-9a40-a71424e980a6=>0=>CND_LNKDN_ID' }
  );
}
node.send(msg);
return;
