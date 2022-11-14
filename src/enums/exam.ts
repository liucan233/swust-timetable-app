export const getExamType = (index: number) => {
  const types = ["期末", "期中", "补考"];
  index -= 1;
  if (index >= types.length || index < 0) {
    return "Error";
  }
  return types[index];
};
