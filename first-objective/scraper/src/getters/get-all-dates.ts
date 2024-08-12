export const getAllDates = ( startDate : string, endDate : string ) : string[] => {
  const dates : string[] = []
  const currentDate = new Date( startDate )
  const finalDate = new Date( endDate )

  while ( currentDate <= finalDate ) {
    const year = currentDate.getFullYear()
    const month = ( currentDate.getMonth() + 1 ).toString().padStart( 2, '0' )
    const day = currentDate.getDate().toString().padStart( 2, '0' )
    dates.push( `${ year }-${ month }-${ day }` )
    currentDate.setDate( currentDate.getDate() + 1 )
  }
  return dates
}
