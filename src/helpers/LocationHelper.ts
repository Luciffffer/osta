import { BoundingBox, BoundingCircle, Location } from '../types'

const EARTH_RADIUS = 6371 // Radius of the earth in km

function calculateDistanceKm(location1: Location, location2: Location): number {
  const dLat = deg2rad(location2.lat - location1.lat)
  const dLon = deg2rad(location2.lng - location1.lng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(location1.lat)) * Math.cos(deg2rad(location2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS * c
}

function getDisplayStringForDistanceInKm(location1: Location, location2: Location): string {
  const distance = calculateDistanceKm(location1, location2)

  if (distance < 0) {
    return (distance * 1000).toFixed(0) + 'm'
  } else {
    return distance.toFixed(2) + 'km'
  }
}

function calculateAngleInDegrees(location1: Location, location2: Location): number {
  const dLon = deg2rad(location2.lng - location1.lng)

  const y = Math.sin(dLon) * Math.cos(location2.lat)
  const x = Math.cos(location1.lat) * Math.sin(location2.lat) - Math.sin(location1.lat) * Math.cos(location2.lat) * Math.cos(dLon)

  return rad2deg(Math.atan2(y, x))
}

function calculateRadiusByBoundingBox(area: BoundingBox): BoundingCircle {
  const { topLeft, bottomRight } = area
  const { lat: lat1, lng: lng1 } = topLeft
  const { lat: lat2, lng: lng2 } = bottomRight

  const centerLat = (lat1 + lat2) / 2
  const centerLon = (lng1 + lng2) / 2

  const latDelta = lat2 - centerLat
  const lonDelta = lng2 - centerLon
  const radiusDegrees = Math.sqrt(latDelta ** 2 + lonDelta ** 2)

  const radiusKm = (2 * Math.PI * EARTH_RADIUS * radiusDegrees) / 360

  return {
    radius: radiusKm,
    center: { lat: centerLat, lng: centerLon },
  }
}

function deg2rad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

function rad2deg(radians: number): number {
  return radians * (180 / Math.PI)
}

export default {
  calculateDistanceKm,
  getDisplayStringForDistanceInKm,
  calculateAngleInDegrees,
  calculateRadiusByBoundingBox,
}
