const navStepWarning = "As Relative URL is being added to access the page directly, It's Default View Navigation Steps will be deleted."
const overrideWarning = "As Relative URL is being removed, Is Page URL Overridden will be set to No & Overriden URLs will be deleted."

if(input[0]['OLD_IS_BASE_URL_OVERRIDDEN'] == 'Yes' && input[0]['IS_BASE_URL_OVERRIDDEN'] == 'Yes' && !input[0]['PAGE_ACCESS_RELATIVE_URL']) {
    input[0]['WARNING_MESSAGE'] = overrideWarning;
} else {
    input[0]['WARNING_MESSAGE'] = navStepWarning;
}
