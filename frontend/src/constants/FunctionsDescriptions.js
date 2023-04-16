const descriptions = {
  union: "Returns a geometry that represents the union of the input geometries' point set.",
  diff: 'Returns a geometry that represents the portion of geometry A that does not intersect geometry B.',
  intersection: 'Returns a geometry that represents the shared part of geometries A and B.',
  contains: 'Returns the geometries of B that are inside A.',
  crosses: 'Returns the geometries of B that have some, but not all, interior points in common with A.',
  touches:
    'Returns the geometries of B that have at least one point in common with A, but their interiors do not intersect.',
  within: 'Returns the geometries of B that are completely inside A.',
  intersects: 'Returns the geometries of B that have at least one point in common with the geometries of A.',
  area: 'Returns the geometry area.',
  distance: 'Returns the smallest distance between geometries A and B.',
  length: 'Returns the length of the geometry (lines).',
  perimeter: 'Returns the value of the geometry boundaries length.',
  buffer: 'Return a geometry covering all points within a determined distance from a geometry.',
  centroid: 'Returns the geometric center of a geometry.',
};

export default descriptions;
