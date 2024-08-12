import fs from 'fs'
import path from 'path'

const dinamicSubstractOneDayOfDate = ( date : string ) : string => {
  const dateArray = date.split( '-' )
  const year = Number( dateArray[ 0 ] )
  const month = Number( dateArray[ 1 ] )
  const day = Number( dateArray[ 2 ] )

  const dateObject = new Date( year, month - 1, day )
  dateObject.setDate( dateObject.getDate() - 1 )
  const newYear = dateObject.getFullYear()
  const newMonth = dateObject.getMonth() + 1
  const newDay = dateObject.getDate()
  const newDate = `${ newYear }-${ newMonth < 10 ? '0' + newMonth : newMonth }-${ newDay < 10 ? '0' + newDay : newDay }`
  return newDate

}

export const renameFiles = ( dirPath: string ) => {
  const allFilesInDir = fs.readdirSync( dirPath )
  const allHtmlFilesInDir = allFilesInDir.filter( ( file ) => file.endsWith( '.html' ) )

  if ( allHtmlFilesInDir.length === 0 ) {
    console.log( 'No files to rename' )
    return
  }

  const allHtmlFilesInDirSorted = allHtmlFilesInDir.sort()

  allHtmlFilesInDirSorted.forEach( ( file ) => {
    const oldPath = path.join( dirPath, file )
    const dateOfFile = file.split( '.' )[ 0 ]
    const newDate = dinamicSubstractOneDayOfDate( dateOfFile )
    const newFilename = `${ newDate }.html`
    const newPath = path.join( dirPath, newFilename )
    fs.renameSync( oldPath, newPath )
    console.log( `File ${ file } renamed to ${ newFilename }` )
  } )

}
