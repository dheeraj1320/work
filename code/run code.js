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
  
    // 11. Convert `FUNCTION` to `[FUNCTION]`
    mssqlQuery = mssqlQuery.replace(
      /featuremanagement_app.FUNCTION/g,
      "[FUNCTION]"
    );
  
    // 12. Convert `BINARY` function (MySQL) to COLLATE SQL_Latin1_General_CP1_CS_AS for MSSQL
    mssqlQuery = mssqlQuery.replaceAll(/BINARY +?[^ ]+/gi, (match, p1) => {
      const value = match.split(" ")[1];
      return ` ${value} COLLATE SQL_Latin1_General_CP1_CS_AS `;
    });
    // 11. covert ! Null Querires
    if (/!\s*ISNULL\(/i.test(mssqlQuery)) {
      mssqlQuery = mssqlQuery.replace(/!\s*ISNULL\((.*?)\)/g, "$1 IS NOT NULL");
    }
    // Replace DUAL with a derived table
    mssqlQuery = mssqlQuery.replace(
      /FROM\s+DUAL/g,
      "FROM (SELECT 1 AS dummy) AS DUAL"
    );
  
    return mssqlQuery;
  };


const query = `SELECT 'AllUnitFunctionalTestCases' as tab, 'Link' as Action, null as TEST_CASE_STEP_UUID,:TEST_CASE_UUID as TEST_CASE_UUID,:USER_ACTION_UUID as USER_ACTION_UUID, IMPACTED_PROCESS_UUID,null as TEST_CASE_REQUIREMENT_UUID,concat( rt.REQUIREMENT_TITLE_ID ,' - ' , rt.REQUIREMENT_TITLE) as REQUIREMENT_TITLE_NAME,process.ASSOCIATION_TYPE,process.REQUIREMENT_UUID,rr.REQUIREMENT_ID as REQUIREMENT_ID,process.CONDITION_SATISFACTION_UUID,process.PROCESS_UUID,process.VIEW_UUID,process.USER_ACTION_UUID,stepUser.FUNCTIONAL_AREA_UUID , rs.PARENT_REQUIREMENT_SET_UUID,concat(rs.REQUIREMENT_SET_ID,' - ',rs.REQUIREMENT_SET_NAME) as REQUIREMENT_SET_UUID from IMPACTED_PROCESS process , TEST_CASE stepUser,REQUIREMENT_TITLE rt, REQUIREMENT rr left JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID =rr.REQUIREMENT_SET_UUID where rt.REQUIREMENT_TITLE_UUID = rr.REQUIREMENT_ASSOCIATION_UUID and rr.REQUIREMENT_UUID=process.REQUIREMENT_UUID and process.USER_ACTION_UUID=:USER_ACTION_UUID and stepUser.TEST_CASE_UUID =:TEST_CASE_UUID and ASSOCIATION_TYPE in ('REQUIREMENT','CONDITION_SATISFACTION') and process.IMPACTED_PROCESS_UUID not in (SELECT process.IMPACTED_PROCESS_UUID FROM IMPACTED_PROCESS process, TEST_CASE_REQUIREMENT tcr where process.IMPACTED_PROCESS_UUID = tcr.IMPACTED_PROCESS_UUID and tcr.TEST_CASE_UUID=:TEST_CASE_UUID ) union SELECT 'AllUnitFunctionalTestCases' as tab, 'Link' as Action, null as TEST_CASE_STEP_UUID,:TEST_CASE_UUID as TEST_CASE_UUID,:USER_ACTION_UUID as USER_ACTION_UUID, IMPACTED_PROCESS_UUID,null as TEST_CASE_REQUIREMENT_UUID,concat ( pr.PROCESS_ID, ' - ' , pr.PROCESS_NAME, ', ', pg.PAGE_ID , ' - ',pg.PAGE_NAME, ', ' ,uva.USER_ACTION_ID,' - ',uva.USER_ACTION_NAME) as REQUIREMENT_TITLE_NAME,process.ASSOCIATION_TYPE,process.REQUIREMENT_UUID,rr.REQUIREMENT_ID as REQUIREMENT_ID,process.CONDITION_SATISFACTION_UUID,process.PROCESS_UUID,process.VIEW_UUID,process.USER_ACTION_UUID,stepUser.FUNCTIONAL_AREA_UUID , rs.PARENT_REQUIREMENT_SET_UUID,concat(rs.REQUIREMENT_SET_ID,' - ',rs.REQUIREMENT_SET_NAME) as REQUIREMENT_SET_UUID from IMPACTED_PROCESS process , TEST_CASE stepUser, PROCESS pr, PAGE pg , VIEW_USER_ACTION uva, REQUIREMENT rr left JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID =rr.REQUIREMENT_SET_UUID where pr.PROCESS_UUID=process.PROCESS_UUID and pg.PAGE_UUID=process.PAGE_UUID and uva.USER_ACTION_UUID= process.USER_ACTION_UUID and rr.REQUIREMENT_UUID=process.REQUIREMENT_UUID and process.USER_ACTION_UUID=:USER_ACTION_UUID and stepUser.TEST_CASE_UUID =:TEST_CASE_UUID and ASSOCIATION_TYPE in ('USER_ACTION_REQUIREMENT','USER_ACTION_CONDITION_SATISFACTION') and process.IMPACTED_PROCESS_UUID not in (SELECT process.IMPACTED_PROCESS_UUID FROM IMPACTED_PROCESS process, TEST_CASE_REQUIREMENT tcr where process.IMPACTED_PROCESS_UUID = tcr.IMPACTED_PROCESS_UUID and tcr.TEST_CASE_UUID=:TEST_CASE_UUID ) Union SELECT 'AllUnitFunctionalTestCases' as tab, 'Unlink' as Action, null as TEST_CASE_STEP_UUID, :TEST_CASE_UUID as TEST_CASE_UUID,:USER_ACTION_UUID as USER_ACTION_UUID,caseReq.IMPACTED_PROCESS_UUID,TEST_CASE_REQUIREMENT_UUID,concat( rt.REQUIREMENT_TITLE_ID ,' - ' , rt.REQUIREMENT_TITLE) as REQUIREMENT_TITLE_NAME,ip.ASSOCIATION_TYPE,caseReq.REQUIREMENT_UUID,rr.REQUIREMENT_ID as REQUIREMENT_ID, caseReq.CONDITION_SATISFACTION_UUID,caseReq.PROCESS_UUID,caseReq.VIEW_UUID,caseReq.USER_ACTION_UUID,stepUser.FUNCTIONAL_AREA_UUID ,rs.PARENT_REQUIREMENT_SET_UUID,concat(rs.REQUIREMENT_SET_ID,' - ',rs.REQUIREMENT_SET_NAME) as REQUIREMENT_SET_UUID from TEST_CASE_REQUIREMENT caseReq , TEST_CASE stepUser , IMPACTED_PROCESS ip, REQUIREMENT_TITLE rt, REQUIREMENT rr left JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID =rr.REQUIREMENT_SET_UUID where rt.REQUIREMENT_TITLE_UUID= rr.REQUIREMENT_ASSOCIATION_UUID and rr.REQUIREMENT_UUID=caseReq.REQUIREMENT_UUID and caseReq.IMPACTED_PROCESS_UUID=ip.IMPACTED_PROCESS_UUID and caseReq.USER_ACTION_UUID=:USER_ACTION_UUID and stepUser.TEST_CASE_UUID = caseReq.TEST_CASE_UUID and caseReq.TEST_CASE_UUID =:TEST_CASE_UUID and ASSOCIATION_TYPE in ('REQUIREMENT','CONDITION_SATISFACTION') union SELECT 'AllUnitFunctionalTestCases' as tab, 'Unlink' as Action, null as TEST_CASE_STEP_UUID, :TEST_CASE_UUID as TEST_CASE_UUID,:USER_ACTION_UUID as USER_ACTION_UUID,caseReq.IMPACTED_PROCESS_UUID,TEST_CASE_REQUIREMENT_UUID,concat ( pr.PROCESS_ID, ' - ' , pr.PROCESS_NAME, ', ', pg.PAGE_ID , ' - ',pg.PAGE_NAME, ', ' ,uva.USER_ACTION_ID,' - ',uva.USER_ACTION_NAME) as REQUIREMENT_TITLE_NAME,ip.ASSOCIATION_TYPE,caseReq.REQUIREMENT_UUID,rr.REQUIREMENT_ID as REQUIREMENT_ID, caseReq.CONDITION_SATISFACTION_UUID,caseReq.PROCESS_UUID,caseReq.VIEW_UUID,caseReq.USER_ACTION_UUID,stepUser.FUNCTIONAL_AREA_UUID,rs.PARENT_REQUIREMENT_SET_UUID ,concat(rs.REQUIREMENT_SET_ID,' - ',rs.REQUIREMENT_SET_NAME) as REQUIREMENT_SET_UUID from TEST_CASE_REQUIREMENT caseReq , TEST_CASE stepUser , IMPACTED_PROCESS ip, PROCESS pr, PAGE pg , VIEW_USER_ACTION uva, REQUIREMENT rr left JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID =rr.REQUIREMENT_SET_UUID where pr.PROCESS_UUID=ip.PROCESS_UUID and pg.PAGE_UUID=ip.PAGE_UUID and uva.USER_ACTION_UUID = ip.USER_ACTION_UUID and rr.REQUIREMENT_UUID=caseReq.REQUIREMENT_UUID and caseReq.IMPACTED_PROCESS_UUID=ip.IMPACTED_PROCESS_UUID and caseReq.USER_ACTION_UUID=:USER_ACTION_UUID and stepUser.TEST_CASE_UUID = caseReq.TEST_CASE_UUID and caseReq.TEST_CASE_UUID =:TEST_CASE_UUID and ASSOCIATION_TYPE in ('USER_ACTION_REQUIREMENT','USER_ACTION_CONDITION_SATISFACTION') order by REQUIREMENT_ID desc;`



console.log('aaaaaa',convertMySQLToMSSQL(query));
// convertMySQLToMSSQL(query);