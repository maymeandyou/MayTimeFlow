import type { Holiday } from "@/types"

// Comprehensive holiday data for multiple countries
const holidays2024: Holiday[] = [
  // United States
  { date: "2024-01-01", name: "New Year's Day", country: "US" },
  { date: "2024-01-15", name: "Martin Luther King Jr. Day", country: "US" },
  { date: "2024-02-19", name: "Presidents' Day", country: "US" },
  { date: "2024-05-27", name: "Memorial Day", country: "US" },
  { date: "2024-06-19", name: "Juneteenth", country: "US" },
  { date: "2024-07-04", name: "Independence Day", country: "US" },
  { date: "2024-09-02", name: "Labor Day", country: "US" },
  { date: "2024-10-14", name: "Columbus Day", country: "US" },
  { date: "2024-11-11", name: "Veterans Day", country: "US" },
  { date: "2024-11-28", name: "Thanksgiving", country: "US" },
  { date: "2024-12-25", name: "Christmas Day", country: "US" },

  // Canada
  { date: "2024-01-01", name: "New Year's Day", country: "CA" },
  { date: "2024-02-19", name: "Family Day", country: "CA" },
  { date: "2024-03-29", name: "Good Friday", country: "CA" },
  { date: "2024-05-20", name: "Victoria Day", country: "CA" },
  { date: "2024-07-01", name: "Canada Day", country: "CA" },
  { date: "2024-08-05", name: "Civic Holiday", country: "CA" },
  { date: "2024-09-02", name: "Labour Day", country: "CA" },
  { date: "2024-10-14", name: "Thanksgiving", country: "CA" },
  { date: "2024-11-11", name: "Remembrance Day", country: "CA" },
  { date: "2024-12-25", name: "Christmas Day", country: "CA" },
  { date: "2024-12-26", name: "Boxing Day", country: "CA" },

  // United Kingdom
  { date: "2024-01-01", name: "New Year's Day", country: "UK" },
  { date: "2024-03-29", name: "Good Friday", country: "UK" },
  { date: "2024-04-01", name: "Easter Monday", country: "UK" },
  { date: "2024-05-06", name: "Early May Bank Holiday", country: "UK" },
  { date: "2024-05-27", name: "Spring Bank Holiday", country: "UK" },
  { date: "2024-08-26", name: "Summer Bank Holiday", country: "UK" },
  { date: "2024-12-25", name: "Christmas Day", country: "UK" },
  { date: "2024-12-26", name: "Boxing Day", country: "UK" },

  // Germany
  { date: "2024-01-01", name: "Neujahr", country: "DE" },
  { date: "2024-01-06", name: "Heilige Drei Könige", country: "DE" },
  { date: "2024-03-29", name: "Karfreitag", country: "DE" },
  { date: "2024-04-01", name: "Ostermontag", country: "DE" },
  { date: "2024-05-01", name: "Tag der Arbeit", country: "DE" },
  { date: "2024-05-09", name: "Christi Himmelfahrt", country: "DE" },
  { date: "2024-05-20", name: "Pfingstmontag", country: "DE" },
  { date: "2024-10-03", name: "Tag der Deutschen Einheit", country: "DE" },
  { date: "2024-12-25", name: "Weihnachtstag", country: "DE" },
  { date: "2024-12-26", name: "Zweiter Weihnachtstag", country: "DE" },

  // France
  { date: "2024-01-01", name: "Jour de l'An", country: "FR" },
  { date: "2024-04-01", name: "Lundi de Pâques", country: "FR" },
  { date: "2024-05-01", name: "Fête du Travail", country: "FR" },
  { date: "2024-05-08", name: "Fête de la Victoire", country: "FR" },
  { date: "2024-05-09", name: "Ascension", country: "FR" },
  { date: "2024-05-20", name: "Lundi de Pentecôte", country: "FR" },
  { date: "2024-07-14", name: "Fête Nationale", country: "FR" },
  { date: "2024-08-15", name: "Assomption", country: "FR" },
  { date: "2024-11-01", name: "Toussaint", country: "FR" },
  { date: "2024-11-11", name: "Armistice", country: "FR" },
  { date: "2024-12-25", name: "Noël", country: "FR" },

  // Italy
  { date: "2024-01-01", name: "Capodanno", country: "IT" },
  { date: "2024-01-06", name: "Epifania", country: "IT" },
  { date: "2024-04-25", name: "Festa della Liberazione", country: "IT" },
  { date: "2024-05-01", name: "Festa del Lavoro", country: "IT" },
  { date: "2024-06-02", name: "Festa della Repubblica", country: "IT" },
  { date: "2024-08-15", name: "Ferragosto", country: "IT" },
  { date: "2024-11-01", name: "Ognissanti", country: "IT" },
  { date: "2024-12-08", name: "Immacolata Concezione", country: "IT" },
  { date: "2024-12-25", name: "Natale", country: "IT" },
  { date: "2024-12-26", name: "Santo Stefano", country: "IT" },

  // Australia
  { date: "2024-01-01", name: "New Year's Day", country: "AU" },
  { date: "2024-01-26", name: "Australia Day", country: "AU" },
  { date: "2024-03-29", name: "Good Friday", country: "AU" },
  { date: "2024-04-01", name: "Easter Monday", country: "AU" },
  { date: "2024-04-25", name: "ANZAC Day", country: "AU" },
  { date: "2024-06-10", name: "Queen's Birthday", country: "AU" },
  { date: "2024-12-25", name: "Christmas Day", country: "AU" },
  { date: "2024-12-26", name: "Boxing Day", country: "AU" },
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
