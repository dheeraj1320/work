const convertMySQLToMSSQL = (mysqlQuery) => {
  let mssqlQuery = mysqlQuery;

  // Replace GROUP_CONCAT with STRING_AGG, remove DISTINCT, and handle SEPARATOR
  mssqlQuery = mssqlQuery.replace(
    /GROUP_CONCAT\s*\(\s*DISTINCT\s*(.+?)\s*SEPARATOR\s*['"](.+?)['"]\s*\)/g,
    "STRING_AGG($1, '$2')"
  );
  // 1. Convert GROUP_CONCAT to STRING_AGG
  mssqlQuery = mssqlQuery.replace(/GROUP_CONCAT\((.*?)\)/g, (match, p1) => {
    return `STRING_AGG(${p1}, ', ')`;
  });

  // 2. Convert LIMIT to TOP (This assumes it's used in SELECT statements only)
  mssqlQuery = mssqlQuery.replace(/LIMIT (\d+)/g, (match, p1) => {
    return `TOP ${p1}`;
  });

  // 3. Convert AUTO_INCREMENT to IDENTITY
  mssqlQuery = mssqlQuery.replace(/AUTO_INCREMENT/g, "IDENTITY");

  // 4. Convert IFNULL to ISNULL
  mssqlQuery = mssqlQuery.replace(/IFNULL\((.*?)\)/g, (match, p1) => {
    return `ISNULL(${p1})`;
  });

  // 5. Convert NOW() to GETDATE()
  mssqlQuery = mssqlQuery.replace(/NOW\(\)/g, "GETDATE()");

  // 6. Convert `BACKTICKS` (MySQL identifier quotes) to square brackets for MSSQL
  mssqlQuery = mssqlQuery.replace(/`/g, "[]");

  // 7. Convert `CONCAT` function (MySQL) to `+` for MSSQL
  // mssqlQuery = mssqlQuery.replaceAll(/CONCAT *?\((.*?)\)/ig, (match, p1) => {
  //     return p1
  //         .split(",")
  //         .map((part) => part.trim())
  //         .join(" + ");
  // });

  // 8. Convert `IF()` (MySQL) to `CASE WHEN` (MSSQL)
  mssqlQuery = mssqlQuery.replace(
    /IF\(([^,]+),([^,]+),([^,]+)\)/g,
    (match, condition, trueResult, falseResult) => {
      return `CASE WHEN ${condition} THEN ${trueResult} ELSE ${falseResult} END`;
    }
  );

  // 9. Convert uuid() to NEWID()
  mssqlQuery = mssqlQuery.replace(/uuid\(\)/g, "NEWID()");

  // 10. Replace double quotes with single quote in string literals
  mssqlQuery = mssqlQuery.replace(/"([^"]*)"/g, (match, content) => {
    return `'${content}'`;
  });

  // 11. Wrap any word containing "TRANSACTION" in square brackets
  mssqlQuery = mssqlQuery.replace(
    /(?<!:)\b(TRANSACTION\w*)\b/gi, // Match "TRANSACTION" and words starting with it, but avoid ":TRANSACTION"
    (match) => `[${match}]`
  );

  // 11. Wrap any word containing "FUNCTION" in square brackets
  mssqlQuery = mssqlQuery.replace(
    /(?<!:)\b(FUNCTION\w*)\b/gi, // Match "FUNCTION" and words starting with it, but avoid ":Function"
    (match) => `[${match}]`
  );

  // 12. Convert `BINARY` function (MySQL) to COLLATE SQL_Latin1_General_CP1_CS_AS for MSSQL
  mssqlQuery = mssqlQuery.replaceAll(/BINARY +?[^ ]+/gi, (match, p1) => {
    const value = match.split(" ")[1];
    return ` ${value} COLLATE SQL_Latin1_General_CP1_CS_AS `;
  });
  // 13. covert ! Null Querires
  if (/!\s*ISNULL\(/i.test(mssqlQuery)) {
    mssqlQuery = mssqlQuery.replace(/!\s*ISNULL\((.*?)\)/g, "$1 IS NOT NULL");
  }

  // 12. Removing appended schema names
  mssqlQuery = mssqlQuery.replaceAll(/featuremanagement_app_audit./g, "");
  mssqlQuery = mssqlQuery.replaceAll(/featuremanagement_app./g, "");
  mssqlQuery = mssqlQuery.replaceAll(/infoorigin_home_md./g, "");
  mssqlQuery = mssqlQuery.replaceAll(/infoorigin_home_md_audit./g, "");
  mssqlQuery = mssqlQuery.replaceAll(/info_authorization./g, "");
  mssqlQuery = mssqlQuery.replaceAll(/info_tenant./g, "");
  mssqlQuery = mssqlQuery.replaceAll(/info_tenant_audit./g, "");


  // Replace DUAL with a derived table
  mssqlQuery = mssqlQuery.replace(
    /FROM\s+DUAL/g,
    "FROM (SELECT 1 AS dummy) AS DUAL"
  );
  mssqlQuery = convertLimitToTop(mssqlQuery);
  return mssqlQuery;
};

const convertLimitToTop = (query) => {
  // Regular expression to find the LIMIT clause
  const limitPattern = /LIMIT\s+(\d+)/i;

  // Check if the query contains a UNION
  const queryParts = query.split(/UNION/i);

  // Process each part separately
  const modifiedQueryParts = queryParts.map((part) => {
    // Check if this part contains a LIMIT clause
    const limitMatch = part.match(limitPattern);
    if (!limitMatch) {
      // If there's no LIMIT clause, return the part as is
      return part.trim();
    }
    // Extract the LIMIT value
    const limitValue = limitMatch[1];
    // Remove the LIMIT clause from the query part
    let partWithoutLimit = part.replace(limitPattern, '').trim();
    // Check if there's already a TOP clause
    if (/SELECT\s+TOP/i.test(partWithoutLimit)) {
      return partWithoutLimit;
    }
    // Add TOP to the SELECT statement
    partWithoutLimit = partWithoutLimit.replace(/SELECT\s+/i, `SELECT TOP ${limitValue} `);
    return partWithoutLimit;
  });
  // Rejoin the parts with UNION
  return modifiedQueryParts.join(' UNION ');
}


const query = `SELECT r.REQUIREMENT_UUID, concat( r.REQUIREMENT_ID, ' - ', r.REQUIREMENT_TEXT ) as REQUIREMENT_TEXT, r.REQUIREMENT_ID, r.REQUIREMENT_ASSOCIATION_UUID, r.REQUIREMENT_ASSOCIATION_TYPE, r.IS_SOLO_REQUIREMENT,rs.REQUIREMENT_SET_UUID as REQUIREMENTSET_PRI_KEY, rs.PARENT_REQUIREMENT_SET_UUID, concat( rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME ) as REQUIREMENT_SET_UUID, concat( cos.CONDITION_SATISFACTION_ID, ' - ', cos.CONDITION_SATISFACTION_NAME ) as CONDITION_SATISFACTION_NAME, cos.CONDITION_SATISFACTION_UUID, vua.USER_ACTION_UUID, :PAGE_UUID AS PAGE_UUID, :PROCESS_UUID AS PROCESS_UUID, :VIEW_UUID AS VIEW_UUID, uuid() as REQ_COS_UUID FROM VIEW_USER_ACTION vua JOIN REQUIREMENT_SET rs ON vua.USER_ACTION_UUID = rs.REQUIREMENT_SET_ASSOCIATION_UUID AND rs.REQUIREMENT_SET_ASSOCIATION_TYPE = 'USER_ACTION' JOIN REQUIREMENT r ON rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID AND r.REQUIREMENT_ASSOCIATION_TYPE = 'USER_ACTION' LEFT JOIN CONDITION_SATISFACTION cos ON r.REQUIREMENT_UUID = cos.REQUIREMENT_UUID AND cos.CONDITION_SATISFACTION_ASSOCIATION_TYPE = 'USER_ACTION' WHERE vua.USER_ACTION_UUID = :USER_ACTION_UUID UNION ALL SELECT r.REQUIREMENT_UUID, concat( r.REQUIREMENT_ID, ' - ', r.REQUIREMENT_TEXT ) as REQUIREMENT_TEXT, r.REQUIREMENT_ID, r.REQUIREMENT_ASSOCIATION_UUID, r.REQUIREMENT_ASSOCIATION_TYPE, r.IS_SOLO_REQUIREMENT, NULL as REQUIREMENTSET_PRI_KEY,NULL AS REQUIREMENT_SET_UUID, NULL AS REQUIREMENT_SET_NAME, concat( cos.CONDITION_SATISFACTION_ID, ' - ', cos.CONDITION_SATISFACTION_NAME ) as CONDITION_SATISFACTION_NAME, cos.CONDITION_SATISFACTION_UUID, vua.USER_ACTION_UUID, :PAGE_UUID AS PAGE_UUID, :PROCESS_UUID AS PROCESS_UUID, :VIEW_UUID AS VIEW_UUID, uuid() as REQ_COS_UUID FROM VIEW_USER_ACTION vua JOIN REQUIREMENT r ON r.REQUIREMENT_ASSOCIATION_UUID = vua.USER_ACTION_UUID AND r.REQUIREMENT_ASSOCIATION_TYPE = 'USER_ACTION' LEFT JOIN CONDITION_SATISFACTION cos ON r.REQUIREMENT_UUID = cos.REQUIREMENT_UUID AND cos.CONDITION_SATISFACTION_ASSOCIATION_TYPE = 'USER_ACTION' WHERE vua.USER_ACTION_UUID = :USER_ACTION_UUID AND r.REQUIREMENT_UUID NOT IN ( SELECT COALESCE(r.REQUIREMENT_UUID, '1') FROM VIEW_USER_ACTION vua LEFT JOIN REQUIREMENT_SET rs ON vua.USER_ACTION_UUID = rs.REQUIREMENT_SET_ASSOCIATION_UUID AND rs.REQUIREMENT_SET_ASSOCIATION_TYPE = 'USER_ACTION' LEFT JOIN REQUIREMENT r ON rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID AND r.REQUIREMENT_ASSOCIATION_TYPE = 'USER_ACTION' WHERE vua.USER_ACTION_UUID = :USER_ACTION_UUID ) ORDER BY REQUIREMENT_ID asc;`



console.log('aaaaaa',convertMySQLToMSSQL(query));
// convertMySQLToMSSQL(query);