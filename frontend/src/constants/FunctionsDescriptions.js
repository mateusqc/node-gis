const descriptions = {
  union: 'Retorna uma geometria que representa a união do conjunto de pontos das geometrias de entrada.',
  diff: 'Retorna uma geometria que representa a parte da geometria A que não faz interseção com a geometria B.',
  intersection: 'Retorna uma geometria que representa a parte compartilhada das geometrias A e B.',
  contains: 'Retorna as geometrias de B que estiverem no interior de A.',
  crosses: 'Retorna as geometrias de B que possuem alguns, mas não todos, pontos internos em comum com A.',
  touches: 'Retorna as geometrias de B que têm pelo menos um ponto em comum com A, mas seus interiores não se cruzam.',
  within: 'Retorna as geometrias de B que estiverem completamente no interior de A.',
  intersects: 'Retorna as geometrias de B que possuem ao menos um ponto em comum com as geometrias de A.',
  area: 'Retorna a área da geometria.',
  distance: 'Retorna a menor distância entre as geometrias A e B.',
  length: 'Retorna o comprimento da geometria (caso seja uma linha).',
  perimeter: 'Retorna o comprimento do limite da geometria.',
  buffer: 'Retorna uma geometria cobrindo todos os pontos dentro de uma determinada distância de uma geometria.',
  centroid: 'Retorna o centro geométrico de uma geometria.',
};

export default descriptions;
