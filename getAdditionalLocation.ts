const getAdditionalLocations = async (req: any, res: any, db: any) => {
    return getAdditionalLocationsByReqId(req.params.REQ_UUID, db);
  };
  
  export const getAdditionalLocationsByReqId = async (reqId : string, db : any) => {
    try {
      const response = await db('REQUIREMENT_CITY_STATE_MAPPING as req')
      .join('STATE as st', 'req.STATE_UUID', 'st.STATE_UUID')
      .select('st.STATE_CODE', 'req.CITY')
      .where({REQUIREMENT_UUID: reqId})
      
      let rowList = [];
      for (var i = 0; i < response.length; i++) {
        let rowMap: any = {};
        rowMap.STATE = response[i].STATE_CODE;
        rowMap.CITY = response[i].CITY;
        rowList.push(rowMap);
      }
      return rowList;
    } catch (err) {
      return err;
    }
  }
  
  export default getAdditionalLocations;