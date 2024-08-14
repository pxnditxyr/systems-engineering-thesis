import { JSDOM } from 'jsdom'
import { IReport } from 'src/interfaces'

const { document } = new JSDOM().window

const serializeTemperatures = ( table : string ) => {

  let allTemperatures = table.match( /(\d+,\d+) °C/g ) ?? []

  const temperaturesNumber = allTemperatures.map( ( temp ) => parseFloat( ( temp.match( /(\d+,\d+)/ ) || [ '-273' ] )[ 0 ].replace( ',', '.' ) ) )
  const temperatures = [ ...new Set( temperaturesNumber ) ]

  if ( temperatures.length === 0 ) {
    const defaultTemp = ( -273 ).toFixed( 4 )
    return {
      min: defaultTemp,
      max: defaultTemp,
      avg: defaultTemp
    }
  }

  const min = Math.min( ...temperatures )
  const max = Math.max( ...temperatures )
  const avg = temperatures.reduce( ( acc, temp ) => acc + temp, 0 ) / temperatures.length
  return {
    min: min.toFixed( 4 ),
    max: max.toFixed( 4 ),
    avg: avg.toFixed( 4 )
  }
}

const serializeWinds = ( table : string ) => {
  const allWinds = table.match( /(\d+,\d+) km\/h, ([A-Z]+)/g ) ?? []
  const winds = allWinds.map( ( wind ) => parseFloat( ( wind.match( /(\d+,\d+)/ ) || [ '-1' ] )[ 0 ].replace( ',', '.' ) ) )

  if ( winds.length === 0 ) {
    const defaultWind = ( -1 ).toFixed( 4 )
    return {
      min: defaultWind,
      max: defaultWind,
      avg: defaultWind
    }
  }

  const min = Math.min( ...winds )
  const max = Math.max( ...winds )
  const avg = winds.reduce( ( acc, wind ) => acc + wind, 0 ) / winds.length
  return {
    min: min.toFixed( 4 ),
    max: max.toFixed( 4 ),
    avg: avg.toFixed( 4 )
  }

}

const serializeVisibilities = ( table : string ) => {

  const allVisibilities = table.match( /(\d+,\d+) km/g ) ?? []
  const visibilities = allVisibilities.map( ( vis ) => parseFloat( ( vis.match( /(\d+,\d+)/ ) || [ '-1' ] )[ 0 ].replace( ',', '.' ) ) )

  if ( visibilities.length === 0 ) {
    const defaultVis = ( -1 ).toFixed( 4 )
    return {
      avg: defaultVis
    }
  }

  const avg = visibilities.reduce( ( acc, vis ) => acc + vis, 0 ) / visibilities.length
  return {
    avg: avg.toFixed( 4 )
  }

}

const getCloudiness = ( table : string ) : string[] => {

  const possibleCloudiness = [
    'Six oktas - 7/10 - 8/10',
    'Mayormente nublado',
    'Nublado',
    'Cubierto',
    'Nubes altas',
    'Nubes medias',
    'Nubes bajas',
    'Pocas nubes',
    'Mayormente despejado',
    'Parcialmente nublado',
    'Three oktas - 4/10',
  ]

  const cloudiness = possibleCloudiness.filter( ( cloud ) => table.includes( cloud ) )
  const noRepeteadCloudiness = [ ...new Set( cloudiness ) ]

  if ( noRepeteadCloudiness.length === 0 ) {
    return [ 'No cloudiness data' ]
  }

  return noRepeteadCloudiness
}

const getAtmosphericPressure = ( table : string ) => {

  const allAtmosphericPressure = table.match( /(\d+.\d+) mbar/g ) ?? []
  const atmosphericPressure = allAtmosphericPressure.map( ( alt ) => parseFloat( ( alt.match( /(\d+.\d+)/ ) || [ '-1' ] )[ 0 ] ) )

  if ( atmosphericPressure.length === 0 ) {
    const defaultPressure = ( -1 ).toFixed( 4 )
    return {
      min: defaultPressure,
      max: defaultPressure,
      avg: defaultPressure
    }
  }

  const min = Math.min( ...atmosphericPressure )
  const max = Math.max( ...atmosphericPressure )
  const avg = atmosphericPressure.reduce( ( acc, alt ) => acc + alt, 0 ) / atmosphericPressure.length

  return {
    min: min.toFixed( 4 ),
    max: max.toFixed( 4 ),
    avg: avg.toFixed( 4 )
  }
}

export const getReportFromHtml = ( html : string ) : IReport => {
  document.body.innerHTML = html

  const tableElement = document.querySelector( '.History-MetarReports-outer_table' )

  if ( !tableElement ) {
    return {
      temp: {
        min: ( -273 ).toFixed( 4 ),
        max: ( -273 ).toFixed( 4 ),
        avg: ( -273 ).toFixed( 4 ),
      },
      wind: {
        min: ( -1 ).toFixed( 4 ),
        max: ( -1 ).toFixed( 4 ),
        avg: ( -1 ).toFixed( 4 )
      },
      visibility: {
        avg: ( -1 ).toFixed( 4 )
      },
      atmosphericPressure: {
        min: ( -1 ).toFixed( 4 ),
        max: ( -1 ).toFixed( 4 ),
        avg: ( -1 ).toFixed( 4 )
      },
      cloudiness: [ 'No cloudiness data' ]
    }
  }

  const table = tableElement.outerHTML

  const serializedTemperatures = serializeTemperatures( table )

  const serializedWinds = serializeWinds( table )

  const serializedVisibilities = serializeVisibilities( table )

  const cloudiness = getCloudiness( table )

  const serializedAtmosphericPressure = getAtmosphericPressure( table )

  return {
    temp: serializedTemperatures,
    wind: serializedWinds,
    visibility: serializedVisibilities,
    atmosphericPressure: serializedAtmosphericPressure,
    cloudiness,
  }
}
