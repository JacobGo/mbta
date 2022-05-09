package main

import (
	"flag"
	"mbta-service/Authentication"
	"mbta-service/Config"
	"mbta-service/Model"
	"strconv"

	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var secret = []byte("kaylee123")

func main() {
	var err error
	Config.DB, err = gorm.Open(sqlite.Open("mbta.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	Config.DB.AutoMigrate(&Model.Series{}, &Model.Car{}, &Model.Fleet{}, &Model.User{}, &Model.Ride{})

	shouldSeed := flag.Bool("seed", false, "seed the database")
	flag.Parse()
	if *shouldSeed {
		Model.SeedRedLine()
		Model.SeedCars()
	}

	router := gin.Default()

	// Auth
	router.Use(sessions.Sessions("mysession", sessions.NewCookieStore(secret)))
	router.POST("/login", Authentication.Login)
	router.POST("/register", Authentication.Register)
	router.GET("/logout", Authentication.Logout)

	router.GET("/series", getSeries)

	private := router.Group("/private")
	private.Use(Authentication.AuthRequired)
	private.POST("/car/:number", rideCar)
	private.GET("/car/:number", getRides)

	private.GET("/me", Authentication.Me)

	router.Run("localhost:8080")
}

func getSeries(c *gin.Context) {
	var series []Model.Series
	Config.DB.Find(&series)
	c.JSON(200, series)
}

func rideCar(c *gin.Context) {
	var car Model.Car

	session := sessions.Default(c)
	user := Model.User{}
	user.FindUserByID(Config.DB, uint(session.Get(Authentication.Userkey).(uint)))

	number, err := strconv.Atoi(c.Param("number"))
	if err != nil {
		c.JSON(400, gin.H{
			"error": "invalid car number",
		})
		return
	}

	car = Model.Car{Number: number}
	Config.DB.Where(&car).First(&car)
	if car.ID == 0 {
		c.JSON(404, gin.H{
			"error": "car not found",
		})
		return
	}

	series := Model.Series{ID: car.SeriesID}
	Config.DB.Where(&series).First(&series)

	ride := Model.Ride{
		UserID: user.ID,
		CarID:  car.ID,
	}
	if err := Config.DB.Create(&ride).Error; err != nil {
		c.JSON(500, gin.H{
			"message": "failed to create ride",
			"error":   err.Error(),
		})
	}

	c.JSON(200, gin.H{
		"series": series,
		"car":    car,
	})
}

func getRides(c *gin.Context) {
	var car Model.Car

	session := sessions.Default(c)
	user := Model.User{}
	user.FindUserByID(Config.DB, uint(session.Get(Authentication.Userkey).(uint)))

	number, err := strconv.Atoi(c.Param("number"))
	if err != nil {
		c.JSON(400, gin.H{
			"error": "invalid car number",
		})
		return
	}

	car = Model.Car{Number: number}
	Config.DB.Where(&car).First(&car)
	if car.ID == 0 {
		c.JSON(404, gin.H{
			"error": "car not found",
		})
		return
	}

	var rides []Model.Ride
	Config.DB.Where(&Model.Ride{CarID: car.ID, UserID: user.ID}).Find(&rides).Order("created_at desc")

	c.JSON(200, rides)
}
