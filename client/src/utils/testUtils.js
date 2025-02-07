/* eslint-disable no-undef */
export const testPolygonOperations = (features, data) => {
    const pointsInside = data.filter(point => 
      turf.booleanPointInPolygon(
        turf.point([point.lon, point.lat]),
        features[0].geometry
      )
    );
    
    console.log('Estatísticas da Área:');
    console.log('Total de Pontos:', pointsInside.length);
    console.log('Soma:', pointsInside.reduce((acc, curr) => acc + Number(curr.censo), 0));
  };