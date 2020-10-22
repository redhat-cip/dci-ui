interface DynamicActionTypes {
  [actionType: string]: string;
}

export function createActionsTypes(resource: string): DynamicActionTypes {
  const RESOURCE = resource.toUpperCase();
  return ["REQUEST", "SUCCESS", "FAILURE"].reduce(
    (accumulator, type) => {
      accumulator[`FETCH_ALL_${type}`] = `FETCH_${RESOURCE}S_${type}`;
      accumulator[`FETCH_${type}`] = `FETCH_${RESOURCE}_${type}`;
      accumulator[`CREATE_${type}`] = `CREATE_${RESOURCE}_${type}`;
      accumulator[`UPDATE_${type}`] = `UPDATE_${RESOURCE}_${type}`;
      accumulator[`DELETE_${type}`] = `DELETE_${RESOURCE}_${type}`;
      return accumulator;
    },
    {
      SET_COUNT: `SET_${RESOURCE}S_COUNT`,
      CLEAR_CACHE: `CLEAR_${RESOURCE}_CACHE`,
    } as DynamicActionTypes
  );
}
