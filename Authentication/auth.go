package Authentication

import (
	"mbta-service/Config"
	"mbta-service/Model"

	"net/http"
	"strings"

	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
)

const Userkey = "user"

// AuthRequired is a simple middleware to check the session
func AuthRequired(c *gin.Context) {
	session := sessions.Default(c)
	user := session.Get(Userkey)
	if user == nil {
		// Abort the request with the appropriate error code
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	// Continue down the chain to handler etc
	c.Next()
}

// login is a handler that parses a form and checks for specific data
func Login(c *gin.Context) {
	session := sessions.Default(c)
	username := c.PostForm("username")
	password := c.PostForm("password")

	// Validate form input
	if strings.Trim(username, " ") == "" || strings.Trim(password, " ") == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameters can't be empty"})
		return
	}

	// Check for username.
	user := Model.User{Username: username}
	if user.UserByUsername(Config.DB) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to find user"})
		return
	}
	// Check Password
	if Model.VerifyPassword(user.Password, password) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong password"})
		return
	}

	// Save the username in the session
	session.Set(Userkey, user.ID)
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully authenticated user"})
}

func Logout(c *gin.Context) {
	session := sessions.Default(c)
	user := session.Get(Userkey)
	if user == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid session token"})
		return
	}
	session.Delete(Userkey)
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}

func Register(c *gin.Context) {
	session := sessions.Default(c)

	user := &Model.User{
		Username: c.PostForm("username"),
		Password: c.PostForm("password"),
		Email:    c.PostForm("email"),
	}
	user.Prepare()
	if err := user.Validate("update"); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid user data", "error": err.Error()})
		return
	}
	if err := user.BeforeSave(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to prepare to save user", "error": err.Error()})
		return
	}

	u, err := user.SaveUser(Config.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save user", "error": err.Error()})
		return
	}

	session.Set(Userkey, u.ID)
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully registered user"})

}

func Me(c *gin.Context) {
	session := sessions.Default(c)
	uid := session.Get(Userkey).(uint)

	user := Model.User{}
	user.FindUserByID(Config.DB.Omit("password"), uid)

	var rides []Model.Ride
	Config.DB.Where(&Model.Ride{UserID: user.ID}).Find(&rides).Order("created_at desc")

	c.JSON(http.StatusOK, gin.H{"user": user, "rides": rides})
}

func Status(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "You are logged in"})
}
