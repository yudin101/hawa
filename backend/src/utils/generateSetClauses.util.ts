export const generateSetClauses = (
  columnNames: string[],
  columnValues: string[],
): { setClauses: string[]; queryValues: string[] } => {
  let setClauses: string[] = [];
  let queryValues: string[] = [columnValues[0] as string];

  for (let i = 1; i < columnNames.length; i++) {
    if (columnValues[i] !== undefined && columnValues[i] !== null) {
      queryValues.push(columnValues[i] as string);
      setClauses.push(`${columnNames[i]} = $${queryValues.length}`);
    }
  }

  return { setClauses, queryValues };
};
