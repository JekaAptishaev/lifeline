package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
    "github.com/dgrijalva/jwt-go"
    "time"
    "lifeline/utils"
    "lifeline/models"
)

var jwtKey = []byte("my_secret_key")

func RegisterUser(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var user models.User
        if err := c.ShouldBindJSON(&user); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
        user.Password = string(hashedPassword)

        if err := db.Create(&user).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
            return
        }

        c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
    }
}

func LoginUser(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var input struct {
            Username string `json:"username"`
            Password string `json:"password"`
        }
        if err := c.ShouldBindJSON(&input); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        var user models.User
        if err := db.Where("username = ?", input.Username).Preload("Tasks").Preload("Events").First(&user).Error; err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
            return
        }

        if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
            return
        }

        expirationTime := time.Now().Add(24 * time.Hour)
        claims := &utils.Claims{
            Username: user.Username,
            StandardClaims: jwt.StandardClaims{
                ExpiresAt: expirationTime.Unix(),
            },
        }

        token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
        tokenString, err := token.SignedString(utils.JwtKey)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
            return
        }

        c.SetSameSite(http.SameSiteLaxMode)
        c.SetCookie("token", tokenString, 3600*24, "", "", false, true)

        c.JSON(http.StatusOK, gin.H{
            "token": tokenString,
            "user":  user,
        })
    }
}
