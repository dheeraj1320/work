SELECT UI_ELEMENT_UUID as id, UI_ELEMENT_UUID as value, UI_ELEMENT_NAME as label FROM UI_ELEMENT 
WHERE PAGE_NEW_UUID=:PAGE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND 
(UI_ELEMENT_STEP_FILTER_TYPE = 'User Input' AND CONCAT(',',UI_ELEMENT_MODE, ',') LIKE CONCAT('%,','Input',',%'))

UNION

SELECT UI_ELEMENT_UUID as id, UI_ELEMENT_UUID as value, UI_ELEMENT_NAME as label FROM UI_ELEMENT 
WHERE PAGE_NEW_UUID=:PAGE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND 
(UI_ELEMENT_STEP_FILTER_TYPE = 'Expected Result' AND CONCAT(',',UI_ELEMENT_MODE, ',') LIKE CONCAT('%,','Output',',%'))





SELECT UI_ELEMENT_GROUP_STEP_UUID,UI_ELEMENT_GROUP_NAME,STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID,UI_ELEMENT_GROUP_STEP_NAME,ueg.UI_ELEMENT_GROUP_UUID,UI_ELEMENT_STEP_FILTER_TYPE,CURRENT_PAGE_CONTEXT,UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS 
FROM UI_ELEMENT_GROUP ueg ,UI_ELEMENT_GROUP_STEP uegs WHERE ueg.UI_ELEMENT_GROUP_UUID=uegs.UI_ELEMENT_GROUP_UUID 
and ueg.UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID 
and ueg.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by UI_ELEMENT_GROUP_STEP_ID asc



