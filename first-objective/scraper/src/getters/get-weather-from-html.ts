import { JSDOM } from 'jsdom'
import type { IWeather } from '../interfaces'

const { document } = new JSDOM().window

const noData = {
  min: -273,
  max: -273,
  avg: -273,
}

export const getWeatherFromHtml = ( html : string ) : IWeather => {
  document.body.innerHTML = html

  const figureChart = document.querySelector( '.Figure-chart' )

  if ( !figureChart ) {
    return { ...noData }
  }

  const figureChartString = figureChart.outerHTML

  const temperatureTexts = figureChartString.match( /\d+,\d+ °C/g ) ?? []

  if ( temperatureTexts.length === 0 ) {
    return { ...noData }
  }


  const temperatures = temperatureTexts.map(
    ( temperature ) => parseFloat(
      temperature.replace( /,/, '.' )
        .replace( / °C/, '' )
    )
  )

  const uniqueTemperatures = [ ...new Set( temperatures ) ]

  const sortedTemperatures = uniqueTemperatures.sort( ( a, b ) => a - b )

  const min = sortedTemperatures.at( 0 )
  const max = sortedTemperatures.at( -1 )

  const avg = sortedTemperatures.reduce( ( acc, temperature ) => acc + temperature, 0 ) / sortedTemperatures.length

  return {
    min: min ?? -273,
    max: max ?? -273,
    avg: avg ?? -273,
  }
}
