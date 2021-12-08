const custDescription = (desc) => {
  if (desc.length <= 170) return desc;
  const newDesc = desc.slice(0, 169).split(' ');
  newDesc.pop();
  return newDesc.join(' ');
};

const getColorRate = (rate) => {
  if (rate <= 3) return { color: '#E90000' };
  if (rate > 3 && rate <= 5) return { color: '#E97E00' };
  if (rate > 5 && rate <= 7) return { color: '#E9D100' };
  return { color: '#66E900' };
};
export { custDescription, getColorRate };
