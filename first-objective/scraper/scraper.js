
import path from 'path'
import fs from 'fs'
import { JSDOM } from 'jsdom'

const extractFromFigureChart = ( document ) => {
  const figureChart = document.querySelector( '.Figure-chart' )

  const figureChartString = new XMLSerializer().serializeToString( figureChart )

  const temperatures = figureChartString.match( /\d+,\d+ °C/g ).map( temperature => parseFloat( temperature.replace( /,/, '.' ).replace( / °C/, '' ) ) )

  const uniqueTemperatures = [ ...new Set( temperatures ) ]

  const sortedTemperatures = uniqueTemperatures.sort( ( a, b ) => a - b )

  const min = sortedTemperatures.at( 0 )
  const max = sortedTemperatures.at( -1 )

  const avg = sortedTemperatures.reduce( ( acc, temperature ) => acc + temperature, 0 ) / sortedTemperatures.length

  const extractDate = () => {
    const monthNames = [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ]
    const title = document.querySelector( '.Figure-title' ).innerText

    const day = title.match( /\d+ de/ )[ 0 ].replace( / de/, '' ).padStart( 2, '0' )
    const month = title.match( /de [a-z]+/ )[ 0 ].replace( /de /, '' )
    const year = title.match( /\d{4}/ )[ 0 ]
    const monthSerialized = monthNames.findIndex( monthName => monthName === month ) + 1

    return `${ year }-${ monthSerialized.toString().padStart( 2, '0' ) }-${ day }`
  }

  return {
    date: extractDate(),
    min,
    max,
    avg,
  }
}

const folderPath = './datos-meteorologicos'
const outputData = []

fs.readdir( folderPath, ( err, files ) => {
  if ( err ) {
    return console.log( 'Unable to scan directory: ' + err );
  }

  files.forEach( ( file ) => {
    if ( file.endsWith( '.html' ) ) {
      const filePath = path.join( folderPath, file );
      const fileContent = fs.readFileSync( filePath, 'utf-8' );
      const dom = new JSDOM( fileContent );
      const document = dom.window.document;

      const data = extractFromFigureChart( document );
      outputData.push( data );
    }
  } );

  console.log(outputData);
} );
