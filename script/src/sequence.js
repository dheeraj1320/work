export const updateSequence = async (req, res, mainKnex, schema_name) => {
  try {
    // Step 1: Get all tables in the given schema.
    const tables = await mainKnex('INFORMATION_SCHEMA.TABLES').select('TABLE_NAME').where('TABLE_SCHEMA', schema_name);

    // Iterate through each table.
    for (const table of tables) {
      const tableName = table.TABLE_NAME;

      // Skip the SEQUENCE table.
      if (tableName.toUpperCase() === 'SEQUENCE') {
        continue;
      }

      // Build the incremental ID column name. For example, for table 'SOME_TABLE_NAME' it becomes 'SOME_TABLE_NAME_ID'
      let idColumn = `${tableName}_ID`;

      // Step 2: Check if the table has the expected id column.
      const columnExists = await mainKnex('INFORMATION_SCHEMA.COLUMNS')
        .select('COLUMN_NAME')
        .where({
          TABLE_SCHEMA: schema_name,
          TABLE_NAME: tableName,
          COLUMN_NAME: idColumn,
        })
        .first();

      // If the default id column is not found...
      if (!columnExists) {
        // Try to get the primary key column of the table.
        console.log(`Column ${idColumn} not found on table ${tableName}. Checking for other column 🤞🤞🤞`);
        const primaryKeyColumn = await mainKnex('INFORMATION_SCHEMA.COLUMNS')
          .select('COLUMN_NAME')
          .where({
            TABLE_SCHEMA: schema_name,
            TABLE_NAME: tableName,
            COLUMN_KEY: 'PRI',
          })
          .first();

        if (primaryKeyColumn && primaryKeyColumn.COLUMN_NAME.includes('UUID')) {
          // Build the alternative incremental column name
          // by replacing "UUID" with "ID" in the primary key column name.
          const altColumn = primaryKeyColumn.COLUMN_NAME.replace('UUID', 'ID');

          // Check if this alternate column exists.
          const altColumnExists = await mainKnex('INFORMATION_SCHEMA.COLUMNS')
            .select('COLUMN_NAME')
            .where({
              TABLE_SCHEMA: schema_name,
              TABLE_NAME: tableName,
              COLUMN_NAME: altColumn,
            })
            .first();

          if (altColumnExists) {
            idColumn = altColumn; // Use the alternative column name.
            console.log('alt column found ☺️ ', altColumn);
          } else {
            console.warn(
              `Neither ${tableName}_ID nor alternative ${altColumn} found in table ${tableName}. Skipping...`
            );
            continue;
          }
        } else {
          console.warn(
            `Column ${tableName}_ID not found on table ${tableName}, and no valid primary key alternative found. Skipping...`
          );
          continue;
        }
      }

      // Step 3: Retrieve the maximum value of the id column for this table.
      const maxIdRow = await mainKnex(`${schema_name}.${tableName}`).max(`${idColumn} as maxId`).first();

      const maxId = maxIdRow?.maxId || 0;

      console.log(`Max ID for table ${tableName}: ${maxId}`);

      // Step 4: Upsert the value in the SEQUENCE table.
      const existingSequence = await mainKnex(`${schema_name}.SEQUENCE`)
        .select('TABLE_NAME')
        .where('TABLE_NAME', tableName)
        .first();

      console.log('existingSequence ========', existingSequence);

      // if (existingSequence) {
      //   // Update the record if it already exists.
      //   await mainKnex(`${schema_name}.SEQUENCE`)
      //     .where('TABLE_NAME', tableName)
      //     .update({
      //       MAX_TABLE_SEQ_ID: maxId,
      //     });
      // } else {
      //   // Insert a new record if it doesn't exist.
      //   await mainKnex(`${schema_name}.SEQUENCE`)
      //     .insert({
      //       TABLE_NAME: tableName,
      //       MAX_TABLE_SEQ_ID: maxId,
      //     });
      // }
    }

    console.log('Script ran successfully! ✅✅✅');
    // Sending a successful response.
    res.status(200).json({ message: 'Sequence table updated successfully' });
  } catch (e) {
    console.error('Error updating sequence table:', e);
    res.status(500).json({
      message: 'Failed to update sequence table',
      error: e.message || e,
    });
  }
};
