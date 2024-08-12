import fs from 'fs'

export class CsvAdapter {
  static read ( path : string ) : string {
    if ( !this.exists( path ) ) throw new Error( `File ${ path } 🗃️ not found` )

    const file = fs.readFileSync( path, 'utf-8' )
    return file
  }

  static create ( path : string, headers : string[] ) : void {
    if ( fs.existsSync( path ) ) return
    const csv = headers.join( ',' )
    fs.writeFileSync( path, `${ csv }\n` )
  }


  static delete ( path : string ) : void {
    if ( !this.exists( path ) ) return
    fs.unlinkSync( path )
  }

  static exists ( path : string ) : boolean {
    return fs.existsSync( path )
  }

  static append ( path : string, headers : string[], data : string[][] ) : void {
    if ( !this.exists( path ) ) throw new Error( `File ${ path } 🗃️ not found` )

    const orderedData = this.orderDataByHeader( path, headers, data )

    const csv = orderedData.map( ( row ) => row.join( ',' ) ).join( '\n' )
    let newContent = `${ csv }\n`
    if ( !this.read( path ).endsWith( '\n' ) ) newContent = `\n${ csv }\n`
    fs.appendFileSync( path, newContent )
  }

  static getHeaders ( path : string ) : string[] {
    const file = this.read( path )
    const headers = file.split( '\n' )[ 0 ].split( ',' )
    return headers
  }

  static fromCsv ( path : string ) : string[][] {
    const file = this.read( path )
    const rows = file.split( '\n' )
    const data = rows.map( ( row ) => row.split( ',' ) )
    if ( data[ data.length - 1 ].length === 1 && data[ data.length - 1 ][ 0 ] === '' )
      data.pop()
    return data
  }

  static readByIndex ( path : string, startIndex : number, endIndex? : number ) : string[][] {
    const data = this.fromCsv( path )
    const end = endIndex ? endIndex : startIndex + 1
    return data.slice( startIndex, end )
  }

  static readFromIndex ( path : string, startIndex : number ) : string[][] {
    const data = this.fromCsv( path )
    return data.slice( startIndex )
  }

  static readByHeader ( path : string, header : string ) : string[][] {
    const headers = this.getHeaders( path )
    const index = headers.indexOf( header )
    const data = this.fromCsv( path )
    return data.map( ( row ) => [ row[ index ] ] )
  }

  static addColumn ( path : string, header : string, data : string[] ) : void {
    const headers = this.getHeaders( path )
    if ( headers.includes( header ) ) throw new Error( `Header ${ header } already exists` )

    const file = this.read( path )
    const rows = file.split( '\n' )
    const newHeaders = [ ...headers, header ]

    const newRows = rows.map( ( row, index ) => {
      if ( index === 0 ) return newHeaders.join( ',' )
      if ( index === rows.length - 1 ) return ''
      return row + ',' + data[ index - 1 ]
    } )

    fs.writeFileSync( path, newRows.join( '\n' ) + '\n' )
  }

  private static orderDataByHeader ( path : string, headers : string[], data : string[][] ) : string[][] {
    const headersFromFile = this.getHeaders( path )
    const orderedData = data.map( ( data ) => {
      const orderedData = headers.map( ( header ) => {
        const index = headersFromFile.indexOf( header )
        return data[ index ]
      } )
      return orderedData
    } )

    return orderedData
  }
}
