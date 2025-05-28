import type { Holiday } from "@/types"

// Sample holiday data - in a real app, this would come from an API
const holidays2024: Holiday[] = [
  { date: "2024-01-01", name: "New Year's Day", country: "US" },
  { date: "2024-07-04", name: "Independence Day", country: "US" },
  { date: "2024-12-25", name: "Christmas Day", country: "US" },
  { date: "2024-01-26", name: "Australia Day", country: "AU" },
  { date: "2024-04-25", name: "ANZAC Day", country: "AU" },
  { date: "2024-01-01", name: "New Year's Day", country: "CA" },
  { date: "2024-07-01", name: "Canada Day", country: "CA" },
  { date: "2024-12-25", name: "Christmas Day", country: "CA" },
]

export function getHolidays(country = "US"): Holiday[] {
  return holidays2024.filter((holiday) => holiday.country === country)
}

export function isHoliday(date: Date, country = "US"): boolean {
  const dateString = date.toISOString().split("T")[0]
  return getHolidays(country).some((holiday) => holiday.date === dateString)
}

export function getHolidayName(date: Date, country = "US"): string | null {
  const dateString = date.toISOString().split("T")[0]
  const holiday = getHolidays(country).find((holiday) => holiday.date === dateString)
  return holiday?.name || null
}
