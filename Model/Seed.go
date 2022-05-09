package Model

import (
	"log"
	"mbta-service/Config"
	"strconv"
)

func SeedRedLine() {
	var series = []Series{
		{SeriesStart: "01500", SeriesEnd: "01523", Manufacturer: "Pullman-Standard", Electrical: "Westinghouse", YearBuilt: 1969, YearRebuilt: 1985, Material: "Aluminum", Width: 122, Length: 828, Seats: 63, ActiveCars: 24},
		{SeriesStart: "01600", SeriesEnd: "01651", Manufacturer: "Pullman-Standard", Electrical: "Westinghouse", YearBuilt: 1969, YearRebuilt: 1985, Material: "Aluminum", Width: 122, Length: 828, Seats: 64, ActiveCars: 44},
		{SeriesStart: "01700", SeriesEnd: "01757", Manufacturer: "UTDC", Electrical: "Westinghouse", YearBuilt: 1987, YearRebuilt: 2011, Material: "Aluminum", Width: 120, Length: 828, Seats: 62, ActiveCars: 56},
		{SeriesStart: "01800", SeriesEnd: "01885", Manufacturer: "Bombardier", Electrical: "General Electric", YearBuilt: 1993, Material: "Stainless-Steel", Width: 120, Length: 828, Seats: 50, ActiveCars: 82},
		{SeriesStart: "1900", SeriesEnd: "2151", Manufacturer: "CRRC", Electrical: "MELCO", YearBuilt: 2019, Material: "Stainless-Steel", Width: 120, Length: 828, Seats: 43, ActiveCars: 8},
	}
	var fleet = Fleet{
		Series: series,
		Line:   Red,
	}
	Config.DB.Create(&fleet)
}

func SeedCars() {
	var series []Series
	Config.DB.Find(&series)
	for _, s := range series {
		start, err := strconv.Atoi(s.SeriesStart)
		if err != nil {
			log.Println("could not convert series start to int")
			continue
		}
		end, err := strconv.Atoi(s.SeriesEnd)
		if err != nil {
			log.Println("could not convert series end to int")
			continue
		}

		for i := start; i <= end; i++ {
			var car Car
			car.SeriesID = s.ID
			car.Number = i
			Config.DB.Create(&car)
		}
	}
}
