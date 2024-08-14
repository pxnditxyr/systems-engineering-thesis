export interface IReport {
  temp: {
    min: string
    max: string
    avg: string
  }
  wind: {
    min: string
    max: string
    avg: string
  }
  visibility: {
    avg: string
  }
  atmosphericPressure: {
    min: string
    max: string
    avg: string
  }
  cloudiness: string[]
}


