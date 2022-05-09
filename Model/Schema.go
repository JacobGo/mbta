package Model

import "time"

type Series struct {
	ID           uint `gorm:"primary_key"`
	FleetID      uint
	SeriesStart  string `json:"series_start"`
	SeriesEnd    string `json:"series_end"`
	Manufacturer string `json:"manufacturer"`
	Electrical   string `json:"electrical"`
	YearBuilt    int    `json:"year_built"`
	YearRebuilt  int    `json:"year_rebuilt"`
	Material     string `json:"material"`
	Width        int    `json:"width"`
	Length       int    `json:"length"`
	Seats        int    `json:"seats"`
	ActiveCars   int    `json:"active_cars"`
}

type Line int

const (
	Red Line = iota
	Green
	Blue
	Orange
)

type Fleet struct {
	ID     uint     `gorm:"primary_key"`
	Series []Series `json:"series"`
	Line   Line     `json:"line"`
}

type Car struct {
	ID       uint `gorm:"primary_key"`
	Number   int  `json:"number"`
	SeriesID uint
}

type Ride struct {
	ID        uint `gorm:"primary_key"`
	CarID     uint
	UserID    uint
	CreatedAt time.Time `json:"created_at"`
}
