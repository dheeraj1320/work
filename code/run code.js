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


const query = `SELECT concat(rt.REQUIREMENT_TITLE_ID,' - ', rt.REQUIREMENT_TITLE) as REQUIREMENT_TITLE_NAME,rs.PARENT_REQUIREMENT_SET_UUID,concat(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) as REQUIREMENT_SET_UUID , r.REQUIREMENT_ID, IMPACTED_USER_STORY_ID, IMPACTED_USER_STORY_UUID, ius.REQUIREMENT_UUID, ius.CONDITION_SATISFACTION_UUID, ius.REQUIREMENT_TITLE_UUID, USER_STORY_UUID,ius.ASSOCIATION_TYPE FROM IMPACTED_USER_STORY ius JOIN REQUIREMENT_TITLE rt ON ius.REQUIREMENT_TITLE_UUID = rt.REQUIREMENT_TITLE_UUID JOIN REQUIREMENT r ON rt.REQUIREMENT_TITLE_UUID = r.REQUIREMENT_ASSOCIATION_UUID AND ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID left join REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID=r.REQUIREMENT_SET_UUID WHERE ius.FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ius.USER_STORY_UUID =:USER_STORY_UUID AND BINARY rt.REQUIREMENT_TITLE =:RequirementTitle and ASSOCIATION_TYPE IN ('FEATURE') Union SELECT concat ( pr.PROCESS_ID, ' - ' , pr.PROCESS_NAME, ', ', pg.PAGE_ID , ' - ',pg.PAGE_NAME, ', ' ,rt.USER_ACTION_ID,' - ',rt.USER_ACTION_NAME) as REQUIREMENT_TITLE_NAME,rs.PARENT_REQUIREMENT_SET_UUID,concat(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) as REQUIREMENT_SET_UUID, r.REQUIREMENT_ID, IMPACTED_USER_STORY_ID, IMPACTED_USER_STORY_UUID, ius.REQUIREMENT_UUID, ius.CONDITION_SATISFACTION_UUID, ius.REQUIREMENT_TITLE_UUID, USER_STORY_UUID,ius.ASSOCIATION_TYPE FROM IMPACTED_USER_STORY ius JOIN VIEW_USER_ACTION rt ON ius.USER_ACTION_UUID = rt.USER_ACTION_UUID JOIN REQUIREMENT r ON rt.USER_ACTION_UUID = r.REQUIREMENT_ASSOCIATION_UUID AND ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID left join REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID=r.REQUIREMENT_SET_UUID JOIN PROCESS pr ON pr.PROCESS_UUID=rt.PROCESS_UUID JOIN PAGE pg ON pg.PAGE_UUID=rt.PAGE_UUID WHERE ius.FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND USER_STORY_UUID =:USER_STORY_UUID AND BINARY concat (pr.PROCESS_NAME, ' - ',pg.PAGE_NAME, ' - ' ,rt.USER_ACTION_NAME) =:RequirementTitle and ASSOCIATION_TYPE IN ('PAGE-EVENT') UNION SELECT concat(rt.REQUIREMENT_TITLE_ID,' - ', rt.REQUIREMENT_TITLE) as REQUIREMENT_TITLE_NAME, rs.PARENT_REQUIREMENT_SET_UUID,concat(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) as REQUIREMENT_SET_UUID,REQUIREMENT_ID, IMPACTED_USER_STORY_ID, IMPACTED_USER_STORY_UUID, ius.REQUIREMENT_UUID, ius.CONDITION_SATISFACTION_UUID, ius.REQUIREMENT_TITLE_UUID, USER_STORY_UUID,ius.ASSOCIATION_TYPE FROM IMPACTED_USER_STORY ius JOIN REQUIREMENT_TITLE rt ON ius.REQUIREMENT_TITLE_UUID = rt.REQUIREMENT_TITLE_UUID JOIN REQUIREMENT r ON rt.REQUIREMENT_TITLE_UUID = r.REQUIREMENT_ASSOCIATION_UUID AND ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID left join REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID=r.REQUIREMENT_SET_UUID WHERE ius.FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND USER_STORY_UUID =:USER_STORY_UUID AND BINARY 'dummy' =:RequirementTitle and ASSOCIATION_TYPE IN ('FEATURE') Union SELECT concat ( pr.PROCESS_ID, ' - ' , pr.PROCESS_NAME, ', ', pg.PAGE_ID , ' - ',pg.PAGE_NAME, ', ' ,rt.USER_ACTION_ID,' - ',rt.USER_ACTION_NAME) as REQUIREMENT_TITLE_NAME,rs.PARENT_REQUIREMENT_SET_UUID,concat(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) as REQUIREMENT_SET_UUID, r.REQUIREMENT_ID, IMPACTED_USER_STORY_ID, IMPACTED_USER_STORY_UUID, ius.REQUIREMENT_UUID, ius.CONDITION_SATISFACTION_UUID, ius.REQUIREMENT_TITLE_UUID, USER_STORY_UUID,ius.ASSOCIATION_TYPE FROM IMPACTED_USER_STORY ius JOIN VIEW_USER_ACTION rt ON ius.USER_ACTION_UUID = rt.USER_ACTION_UUID JOIN REQUIREMENT r ON rt.USER_ACTION_UUID = r.REQUIREMENT_ASSOCIATION_UUID AND ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID left join REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID=r.REQUIREMENT_SET_UUID JOIN PROCESS pr ON pr.PROCESS_UUID=rt.PROCESS_UUID JOIN PAGE pg ON pg.PAGE_UUID=rt.PAGE_UUID WHERE ius.FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND USER_STORY_UUID =:USER_STORY_UUID AND BINARY 'dummy' =:RequirementTitle and ASSOCIATION_TYPE IN ('PAGE-EVENT') ORDER BY REQUIREMENT_ID DESC;`



console.log('aaaaaa',convertMySQLToMSSQL(query));
// convertMySQLToMSSQL(query);