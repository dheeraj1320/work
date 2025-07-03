import { v4 as uuidv4 } from "uuid";
 
export const updateApiDataFix = async (req, res, knex, auditKnex) => {
  const schema = "infoqa";
 
  try {
    const apiRecords = await knex.withSchema(schema).from("API_NEW");
    for (let api of apiRecords) {
      console.log(api["API_NAME"], api["API_UUID"]);
      const apiUUID = api["API_UUID"];
      const transactionID = uuidv4();
      let updated = false;
      let oldNew = {};
      let ownerID = api["AE_UPDATE_ID"]
        ? api["AE_UPDATE_ID"]
        : api["AE_INSERT_ID"];
 
      const proxyIndicator = api["USE_PROXY_INDICATOR"] ?? "No";
 
      const attributeTypes = await knex
        .withSchema(schema)
        .from("API_ATTRIBUTE")
        .where("API_UUID", apiUUID)
        .pluck("ATTRIBUTE_TYPE");
 
      const hasJsonType = attributeTypes.some(
        (type) => type == "Input JSON" || type == "Output JSON"
      );
      const newLocator = hasJsonType ? "Automated" : "Manual";
 
      oldNew["ATTRIBUTE_LOCATOR_IDENTIFIER"] = {
        oldValue: api["ATTRIBUTE_LOCATOR_IDENTIFIER"],
        newValue: newLocator,
      };
 
      console.log(
        `📝 Changing ATTRIBUTE_LOCATOR_IDENTIFIER for ${api["API_NAME"]} from ${api["ATTRIBUTE_LOCATOR_IDENTIFIER"]} to ${newLocator}`
      );
      api["ATTRIBUTE_LOCATOR_IDENTIFIER"] = newLocator;
      updated = true;
 
      if (updated) {
        await knex
            .withSchema(schema)
          .from("API_NEW")
          .where("API_UUID", apiUUID)
          .update({
            USE_PROXY_INDICATOR: proxyIndicator,
            ATTRIBUTE_LOCATOR_IDENTIFIER: api["ATTRIBUTE_LOCATOR_IDENTIFIER"],
            AE_UPDATE_ID: ownerID,
            AE_UPDATE_TS: new Date(),
            AE_TRANSACTION_ID: transactionID,
          });
 
        const auditEntry = {
          API_UUID: api["API_UUID"],
          API_ID: api["API_ID"],
          API_NAME: api["API_NAME"],
          API_URL: api["API_URL"],
          API_AUTH: api["API_AUTH"],
          API_HEADER: api["API_HEADER"],
          USE_PROXY_INDICATOR: proxyIndicator,
          FUNCTIONAL_AREA_UUID: api["FUNCTIONAL_AREA_UUID"],
          ATTRIBUTE_LOCATOR_IDENTIFIER: api["ATTRIBUTE_LOCATOR_IDENTIFIER"],
        };
 
        auditEntry["AE_OLD_NEW_COMPARISION_DETAILS"] = JSON.stringify(oldNew);
        auditEntry["AE_AUDIT_UUID"] = uuidv4();
        auditEntry["AE_OPERATION_TYPE"] = "Update";
        auditEntry["AE_TIMESTAMP"] = new Date();
        auditEntry["OPERATION_PERFORMED_BY"] = ownerID;
        auditEntry["AE_INSERT_ID"] = ownerID;
        auditEntry["AE_UPDATE_ID"] = ownerID;
        auditEntry["AE_INSERT_TS"] = new Date();
        auditEntry["AE_UPDATE_TS"] = new Date();
        auditEntry["AE_TRANSACTION_ID"] = transactionID;
 
        await auditKnex
          .withSchema(schema)
          .insert(auditEntry)
          .into("API_NEW_AUDIT"); // insert in audit
        console.log(`✔️ Updated and audited API: ${api["API_NAME"]}`);
      }
    }
    console.log("✅ Script executed successfully.");
    return res.status(200).json({ message: "Script ran successfully! ✅✅✅" });
    // process.exit(0);
  } catch (error) {
    console.error("❌ Error executing script:", error);
    // process.exit(1);
    return res
      .status(500)
      .json({ message: "Error executing script", error: error.message });
  }
};
 
 