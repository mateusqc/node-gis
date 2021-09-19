export const getStyleWithColorFunction = (style) => {
  const { equal, defaultColor, values, column } = style;
  const conditions = values.sort((a, b) => a.pos - b.pos);

  const colorFunction = (properties) => {
    const innerConditions = conditions;
    const mapValue = properties[column];
    let resultColor;
    innerConditions.forEach(({ value, color }) => {
      if ((!equal && mapValue >= value) || (equal && mapValue == value)) {
        resultColor = color;
      }
    });
    return resultColor ?? defaultColor;
  };

  const result = Object.assign({}, style);
  result.colorFunction = colorFunction;

  return result;
};
