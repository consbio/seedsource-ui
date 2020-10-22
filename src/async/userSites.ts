import { UserSite } from '../reducers/runConfiguration'
import resync from '../resync'
import { urlEncode } from '../io'
import { setUserSiteScore } from '../actions/point'

const sitesSelect = ({ runConfiguration, job }: any) => {
  const { userSites }: { userSites: UserSite[] } = runConfiguration
  const { serviceId }: { serviceId: string } = job

  return {
    userSites,
    serviceId,
  }
}

export default (store: any) => {
  resync(store, sitesSelect, (state, io, dispatch, previousState) => {
    if (!previousState) {
      return
    }

    const { userSites, serviceId } = state
    const { userSites: prevUserSites, serviceId: prevServiceId } = previousState

    let sitesToUpdate: UserSite[] = []

    if (serviceId !== prevServiceId) {
      sitesToUpdate = userSites
    } else {
      sitesToUpdate = userSites.slice(0, Math.max(0, userSites.length - prevUserSites.length))
    }

    sitesToUpdate.forEach(({ lat, lon }) => {
      const point = { x: lon, y: lat }
      const url = `/arcgis/rest/services/${serviceId}/MapServer/identify/?${urlEncode({
        f: 'json',
        tolerance: 2,
        imageDisplay: '1600,1031,96',
        geometryType: 'esriGeometryPoint',
        mapExtent: '0,0,0,0',
        geometry: JSON.stringify(point),
      })}`

      io.get(url).then(response =>
        response.json().then(json => {
          const score = json.results[0].attributes['Pixel value']
          dispatch(setUserSiteScore({ lat, lon }, score || 0))
        }),
      )
    })
  })
}
