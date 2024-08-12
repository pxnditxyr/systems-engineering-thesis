
export const generateWeatherLinks = ( startDate : string, endDate : string ) : string[] => {
  const links = []
  const currentDate = new Date( startDate )
  const finalDate = new Date( endDate )

  while ( currentDate <= finalDate ) {
    const year = currentDate.getFullYear()
    const month = ( currentDate.getMonth() + 1 ).toString().padStart( 2, '0' )
    const day = currentDate.getDate().toString().padStart( 2, '0' )
    const baseURL = `https://es.weatherspark.com/h/d/27348/${ year }/${ month }/${ day }/Tiempo-hist%C3%B3rico-el-${ currentDate.toLocaleDateString( 'es-ES', { weekday: 'long' } ).toLowerCase() }-${ day }-de-${ month }-${ year }-en-La-Paz-Bolivia`;

    links.push( baseURL )
    currentDate.setDate( currentDate.getDate() + 1 )
  }

  return links
}
