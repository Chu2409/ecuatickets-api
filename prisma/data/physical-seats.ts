import { Prisma } from '@prisma/client'

export const physicalSeats: Prisma.PhysicalSeatCreateManyInput[] = [
  // Bus 1 (Total 56 asientos: 48 Normal, 8 VIP)
  // 14 filas (4 columnas x 14 filas = 56 asientos)
  ...generateSeatsForBus({
    busId: 1,
    normalSeats: 48,
    vipSeats: 8,
    rows: 14,
    columns: 4,
    floor: 1,
  }),

  // Bus 2 (Total 48 asientos: 43 Normal, 5 VIP)
  // 12 filas (4 columnas x 12 filas = 48 asientos)
  ...generateSeatsForBus({
    busId: 2,
    normalSeats: 43,
    vipSeats: 5,
    rows: 12,
    columns: 4,
    floor: 1,
    // skipLast: 3,
  }),
]

function generateSeatsForBus(options: {
  busId: number
  normalSeats: number
  vipSeats: number
  rows: number
  columns: number
  floor: number
  skipLast?: number
}): Prisma.PhysicalSeatCreateManyInput[] {
  const seats: Prisma.PhysicalSeatCreateManyInput[] = []
  const totalSeats = options.rows * options.columns
  const seatsToGenerate = totalSeats - (options.skipLast || 0)

  // Posiciones estratégicas para VIP (primera fila) y discapacitados (filas cercanas a la entrada)
  const vipPositions = [
    { row: 1, column: 1 },
    { row: 1, column: 2 },
    { row: 1, column: 3 },
    { row: 1, column: 4 },
  ].slice(0, options.vipSeats)

  let normalCount = 0
  let vipCount = 0

  for (let row = 1; row <= options.rows; row++) {
    for (let col = 1; col <= options.columns; col++) {
      const seatNumber = (row - 1) * options.columns + col

      // Saltar los últimos asientos si es necesario
      if (seatNumber > seatsToGenerate) {
        continue
      }

      const columnLetter = String.fromCharCode(64 + col) // 1 => 'A', 2 => 'B', etc.
      const seatName = `${row}${columnLetter}`

      // Verificar si es asiento VIP
      const isVip = vipPositions.some(
        (pos) => pos.row === row && pos.column === col,
      )

      let seatTypeId = 1 // Normal por defecto

      if (isVip && vipCount < options.vipSeats) {
        seatTypeId = 2 // VIP
        vipCount++
      } else {
        normalCount++
      }

      seats.push({
        seatNumber: seatName,
        row,
        column: col,
        floor: options.floor,
        busId: options.busId,
        seatTypeId,
      })
    }
  }

  return seats
}
