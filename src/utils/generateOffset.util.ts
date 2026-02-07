export const generateOffset = (page: number, limit: number) => {
  return (page - 1) * limit;
};
