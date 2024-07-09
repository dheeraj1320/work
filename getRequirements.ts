import jsonToHtml from "../../provider/jsonToHtmlConvertor";
import moment from "moment";
import { getAdditionalLocationsByReqId } from "./getAdditionalLocations";
const currentDate = moment().utc().format("YYYY-MM-DD");

const getRequirementsData = async (req: any, res: any, db: any) => {
  try {
    const response = await db
      .select(
        "REQUIREMENT_UUID",
        "CHECKLIST_UUID",
        "REQUIREMENT_ID",
        "PSTN_LCTN",
        "CLNT_NM",
        "PSTN_DURTN",
        "PSTN_TYP",
        "REQ_VNDR",
        "PSTN_RATE",
        "REQ_RCVD_DT",
        "REQ_STATUS",
        "REQ_ASSIGN_TO",
        "REQ_ADDED_BY",
        "REQ_CLSD_DT",
        "REQ_RMK",
        "CHANGE_LOG_TX",
        "REQ_DOC_ATCH_LOB",
        "REQ_DOC_FILE_CNTNT_TYP_TX",
        "REQ_DOC_FILE_NM_TX",
        "PSTN_TITLE",
        "SKLL_KYWD",
        "INTVW_TYP",
        "REQ_DETAILS",
        "ACCOUNT_MANAGER",
        "NO_OF_POSITION",
        "TARGET_DATE",
        "INDUSTRY",
        "WORK_EXPERIENCE",
        "REQUIRED_DOCUMENTS",
        "PRIORITY",
        "WORK_AUTHORIZATION",
        "DEGREE",
        "INTERNAL_JOB_DESCRIPTION",
        "COUNTRY",
        "STATE",
        "CITY",
        "ZIPCODE",
        "REQUIREMENT_STAGE",
        "AE_INSERT_ID",
        "AE_UPDATE_ID",
        "AE_INSERT_TS",
        "AE_UPDATE_TS",
        "AE_TRANSACTION_ID",
        "IS_MULTI_LOCATION_POSITION",
        "WORK_LOCATION_PREFERENCE",
        db.raw(
          `(CASE WHEN PSTN_TYP = 'Contract' THEN 'Market Rate' WHEN PSTN_TYP = 'Contract-to-Hire' THEN 'Market Rate' ELSE PSTN_RATE END) AS PSTN_RATE`,
        ),
      )
      .from("REQUIREMENT")
      .where("REQ_STATUS", "In-Progress")
      .andWhere("TARGET_DATE", ">=", currentDate)
      .orderBy("REQUIREMENT_ID", "desc");

    let rowList = [];
    for (var i = 0; i < response.length; i++) {
      let rowMap: any = {};
      rowMap.REQUIREMENT_UUID = response[i].REQUIREMENT_UUID;
      rowMap.REQ_ID = response[i].REQUIREMENT_ID;
      rowMap.INTERNAL_JOB_DESCRIPTION = response[i].INTERNAL_JOB_DESCRIPTION
        ? jsonToHtml.rawToDraft(response[i].INTERNAL_JOB_DESCRIPTION)
        : "";
      rowMap.PSTN_LCTN = response[i].PSTN_LCTN;
      rowMap.PSTN_RATE = response[i].PSTN_RATE;
      rowMap.PSTN_TYP = response[i].PSTN_TYP;
      rowMap.PSTN_DURTN = response[i].PSTN_DURTN;
      rowMap.INTVW_TYP = response[i].INTVW_TYP;
      rowMap.PSTN_TITLE = response[i].PSTN_TITLE;
      rowMap.COUNTRY = response[i].COUNTRY;
      rowMap.IS_MULTI_LOCATION_POSITION = response[i].IS_MULTI_LOCATION_POSITION;
      
      let additionalLoc = null;
      if(rowMap.IS_MULTI_LOCATION_POSITION === "Yes"){
        additionalLoc = await getAdditionalLocationsByReqId(response[i].REQUIREMENT_UUID, db);
      }
      rowMap.ADDITIONAL_LOCATIONS = additionalLoc;
      
      rowMap.WORK_LOCATION_PREFERENCE = response[i].WORK_LOCATION_PREFERENCE;
      rowList.push(rowMap);
    }

    return rowList;
  } catch (err) {
    return err;
  }
};
export default getRequirementsData;
