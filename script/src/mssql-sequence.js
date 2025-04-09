export const updateMssqlSequence = async (req, res, mainKnex, schema_name) => {
    try {
      const tables = await mainKnex('INFORMATION_SCHEMA.TABLES')
        .select('TABLE_NAME')
        .where('TABLE_SCHEMA', schema_name);
  
      for (const table of tables) {
        const tableName = table.TABLE_NAME;
  
        if (tableName.toUpperCase() === 'SEQUENCE') continue;
  
        let idColumn = `${tableName}_ID`;
  
        const columnExists = await mainKnex('INFORMATION_SCHEMA.COLUMNS')
          .select('COLUMN_NAME')
          .where({
            TABLE_SCHEMA: schema_name,
            TABLE_NAME: tableName,
            COLUMN_NAME: idColumn,
          })
          .first();
  
        if (!columnExists) {
            console.log(`Column ${idColumn} not found on table ${tableName}. Checking for other column 🤞🤞🤞`);
  
          // Get primary key column for MSSQL
          const primaryKeyColumn = await mainKnex('INFORMATION_SCHEMA.KEY_COLUMN_USAGE as kcu')
            .join('INFORMATION_SCHEMA.TABLE_CONSTRAINTS as tc', function () {
              this.on('kcu.CONSTRAINT_NAME', '=', 'tc.CONSTRAINT_NAME')
                .andOn('kcu.TABLE_NAME', '=', 'tc.TABLE_NAME')
                .andOn('kcu.TABLE_SCHEMA', '=', 'tc.TABLE_SCHEMA');
            })
            .select('kcu.COLUMN_NAME')
            .where({
              'tc.CONSTRAINT_TYPE': 'PRIMARY KEY',
              'kcu.TABLE_NAME': tableName,
              'kcu.TABLE_SCHEMA': schema_name,
            })
            .first();
  
          if (primaryKeyColumn && primaryKeyColumn.COLUMN_NAME.includes('UUID')) {
            const altColumn = primaryKeyColumn.COLUMN_NAME.replace('UUID', 'ID');
  
            const altColumnExists = await mainKnex('INFORMATION_SCHEMA.COLUMNS')
              .select('COLUMN_NAME')
              .where({
                TABLE_SCHEMA: schema_name,
                TABLE_NAME: tableName,
                COLUMN_NAME: altColumn,
              })
              .first();
  
            if (altColumnExists) {
              idColumn = altColumn;
              console.log('alt column found ☺️ ', altColumn);
            } else {
              console.warn(`No valid ID column found for table ${tableName}. Skipping......`);
              continue;
            }
          } else {
            console.warn(`No primary key column with 'UUID' found in table ${tableName}. Skipping.`);
            continue;
          }
        }
  
        // Get max ID
        const maxIdRow = await mainKnex(`${schema_name}.${tableName}`).max(`${idColumn} as maxId`).first();
        const maxId = maxIdRow?.maxId || 0;
        console.log(`Max ID for ${tableName}: ${maxId}`);
  
        // Upsert logic for MSSQL (manual check + insert/update)
        const existing = await mainKnex(`${schema_name}.SEQUENCE`)
          .select('TABLE_NAME')
          .where('TABLE_NAME', tableName)
          .first();
      console.log('existing ========', existing);

  
        if (existing) {
          await mainKnex(`${schema_name}.SEQUENCE`)
            .where('TABLE_NAME', tableName)
            .update({ MAX_TABLE_SEQ_ID: maxId });
        } else {
          await mainKnex(`${schema_name}.SEQUENCE`)
            .insert({ TABLE_NAME: tableName, MAX_TABLE_SEQ_ID: maxId });
        }
      }
  
      console.log('Script ran successfully! ✅✅✅');
      res.status(200).json({ message: 'Sequence table updated successfully' });
    } catch (e) {
      console.error('Error updating sequence table:', e);
      res.status(500).json({
        message: 'Failed to update sequence table',
        error: e.message || e,
      });
    }
  };
  