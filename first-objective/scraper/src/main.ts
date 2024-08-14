import fs from 'fs'
import path from 'path'
// import { generateWeatherLinks } from './generators'
// import { processLinks } from './scraper'
// import { renameFiles } from './utils'
// import { IWeather } from './interfaces'
import { CsvAdapter } from './adapters'
import { getReportFromHtml, getWeatherFromHtml } from './getters'

const dirPath = 'weather-data'
const folderPath = path.join( __dirname, dirPath )

// [INFO]: Generate and save links
//
// const generateAndSaveLinks = () => {
//   // const startDate = '1938-04-01'
//   const startDate = '1984-07-27'
//   const endDate = '2024-08-09'
//   const weatherLinks : string[] = generateWeatherLinks( startDate, endDate )
//   const csvPath = path.join( folderPath, 'weather-links-1.csv' )
//   CsvAdapter.delete( csvPath )
//   CsvAdapter.create( csvPath, [ 'link' ] )
//   CsvAdapter.append( csvPath, [ 'link' ], weatherLinks.map( ( link ) => [ link ] ) )
//
//   const dates = getAllDates( startDate, endDate )
//   CsvAdapter.addColumn( csvPath, 'date', dates )
// }
// generateAndSaveLinks()
//
// // [INFO]: Get html from links
//
// const getAllHtml = async () => {
//   // const startDate = '1938-04-01'
//   // veintiseis
//   const startDate = '1984-07-26'
//   const endDate = '2024-08-09'
//
//   const dates = getAllDates( startDate, endDate )
//   const weatherLinksPath = path.join( folderPath, 'weather-links-1.csv' )
//   const weatherLinks = CsvAdapter.fromCsv( weatherLinksPath ).map( ( row ) => row[ 0 ] )
//   const folderPathForHtml = path.join( folderPath, 'html' )
//
//   await processLinks( weatherLinks, folderPathForHtml, 1, dates )
// }
//
// getAllHtml()

// [INFO]: Rename files to date of 1 day before
const folderPathForHtml = path.join( folderPath, 'html' )
// renameFiles( folderPathForHtml )


// const getHtml = ( path : string ) : string => {
//   if ( !fs.existsSync( path ) )
//     throw new Error( `File ${ path } not found` )
//
//   const file = fs.readFileSync( path, 'utf-8' )
//   return file
// }
//
// const getAllWeatherDataFromDirectory = ( folderPath : string ) => {
//   const files = fs.readdirSync( folderPath )
//
//   const weatherData : IWeather[] = []
//   for ( const file of files ) {
//     const html = getHtml( `${ folderPath }/${ file }` )
//
//     console.log({
//       file,
//       html: html.length
//     })
//     const weather = getWeatherFromHtml( html )
//     weatherData.push( weather )
//   }
//
//   const weatherOrdered = weatherData.sort(
//     ( a, b ) => a.date.localeCompare( b.date )
//   )
//   return weatherOrdered
// }
//
// const weatherOrdered = getAllWeatherDataFromDirectory( folderPathForHtml )
// const csvPath = path.join( folderPath, 'weather-data.csv' )
// CsvAdapter.delete( csvPath )
// CsvAdapter.create( csvPath, [ 'date', 'min', 'max', 'avg' ] )
// CsvAdapter.append( csvPath, [ 'date', 'min', 'max', 'avg' ], weatherOrdered.map( ( weather ) => [ weather.date, weather.min.toString(), weather.max.toString(), weather.avg.toString() ] ) )

// [INFO]: Get weather data from all directory html
// const getAllWeatherDataFromDirectory = ( folderPathForHtml : string, outputPath : string ) => {
//   const csvPath = path.join( outputPath, 'weather-data.csv' )
//   const files = fs.readdirSync( folderPathForHtml )
//   const htmlFiles = files.filter( ( file ) => file.includes( '.html' ) )
//   const orderedFiles = htmlFiles.sort( ( a, b ) => a.localeCompare( b ) )
//
//   for ( const file of orderedFiles ) {
//     console.log( `Processing ${ file }` )
//     const html = fs.readFileSync( `${ folderPathForHtml }/${ file }`, 'utf-8' )
//     const weather = getWeatherFromHtml( html )
//     const date = file.replace( '.html', '' )
//
//     CsvAdapter.append( csvPath, [ 'date', 'min', 'max', 'avg' ], [[ date, weather.min.toString(), weather.max.toString(), weather.avg.toString() ]] )
//   }
// }
//
// getAllWeatherDataFromDirectory( folderPathForHtml, folderPath )

// [INFO]: Get weather data from all directory html
const getReportFromDirectory = ( folderPathForHtml : string, outputPath : string ) => {
  const files = fs.readdirSync( folderPathForHtml )
  const htmlFiles = files.filter( ( file ) => file.includes( '.html' ) )
  const orderedFiles = htmlFiles.sort( ( a, b ) => a.localeCompare( b ) )

  const windCsvPath = path.join( outputPath, 'wind-data.csv' )
  const visibilityCsvPath = path.join( outputPath, 'visibility-data.csv' )
  const atmosphericPressureCsvPath = path.join( outputPath, 'atmospheric-pressure-data.csv' )
  const cloudinessCsvPath = path.join( outputPath, 'cloudiness-data.csv' )

  CsvAdapter.delete( windCsvPath )
  CsvAdapter.delete( visibilityCsvPath )
  CsvAdapter.delete( atmosphericPressureCsvPath )
  CsvAdapter.delete( cloudinessCsvPath )

  CsvAdapter.create( windCsvPath, [ 'date', 'min', 'max', 'avg' ] )
  CsvAdapter.create( visibilityCsvPath, [ 'date', 'avg' ] )
  CsvAdapter.create( atmosphericPressureCsvPath, [ 'date', 'min', 'max', 'avg' ] )
  CsvAdapter.create( cloudinessCsvPath, [ 'date', 'cloudiness' ] )

  for ( const file of orderedFiles ) {
    console.log( `Processing ${ file }` )
    const html = fs.readFileSync( `${ folderPathForHtml }/${ file }`, 'utf-8' )
    const date = file.replace( '.html', '' )
    const report = getReportFromHtml( html )
    const { wind, cloudiness, visibility, atmosphericPressure } = report

    CsvAdapter.append( windCsvPath, [ 'date', 'min', 'max', 'avg' ], [[ date, wind.min, wind.max, wind.avg ]] )
    CsvAdapter.append( visibilityCsvPath, [ 'date', 'avg' ], [[ date, visibility.avg ]] )
    CsvAdapter.append( atmosphericPressureCsvPath, [ 'date', 'min', 'max', 'avg' ], [[ date, atmosphericPressure.min, atmosphericPressure.max, atmosphericPressure.avg ]] )
    CsvAdapter.append( cloudinessCsvPath, [ 'date', 'cloudiness' ], cloudiness.map( ( cloud ) => [ date, cloud ] ) )
  }
}

getReportFromDirectory( folderPathForHtml, folderPath )
