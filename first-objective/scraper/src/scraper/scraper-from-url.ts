import fs from 'fs'
import path from 'path'

export const fetchHTML = async ( url : string ) : Promise<string> => {
  const response = await fetch( url )
  if ( !response.ok ) {
    throw new Error( `Failed to fetch ${ url }: ${ response.statusText }` )
  }
  return response.text()
}

export const delay = ( seconds : number ) : Promise<void> => {
  return new Promise( resolve => setTimeout( resolve, seconds * 1000 ) )
}

export const processLinks = async ( links : string[], folderPath : string, delayTime : number, names? : string[] ) : Promise<void> => {
  if ( !fs.existsSync( folderPath ) ) {
    fs.mkdirSync( folderPath )
  }

  for ( const link of links ) {
    try {
      const html = await fetchHTML( link )
      const urlParts = link.split( '/' )

      const date = urlParts.at( -1 ) || urlParts.at( -2 )

      const fileName = names ? `${ names[ links.indexOf( link ) ] }.html` : `${ date }.html`
      const filePath = path.join( folderPath, fileName )

      fs.writeFileSync( filePath, html, 'utf8' )
      console.log( `Saved: ${ filePath }` )

    } catch ( error ) {
      console.error( 'Error fetching HTML:', error )
    }
    await delay( delayTime )
  }
}
