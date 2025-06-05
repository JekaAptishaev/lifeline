package main

import (
    "github.com/gin-gonic/gin"
    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/postgres"
    "lifeline/handlers"
    "lifeline/middleware"
)

func main() {
    db, err := gorm.Open("postgres", "host=localhost user=postgres dbname=lifeline sslmode=disable password=")
    if err != nil {
        panic("failed to connect database")
    }
    defer db.Close()

    db.AutoMigrate(&handlers.User{}, &handlers.Task{})

    r := gin.Default()
    r.Use(middleware.CORSMiddleware())

    r.POST("/register", handlers.RegisterUser(db))
    r.POST("/login", handlers.LoginUser(db))

    protected := r.Group("/api")
    protected.Use(middleware.AuthMiddleware())
    {
        protected.POST("/tasks", handlers.CreateTask(db))
        protected.GET("/tasks", handlers.GetTasks(db))
        protected.POST("/events", handlers.CreateEvent(db))
        protected.GET("/events", handlers.GetEvents(db))
    }

    r.Run(":8080")
}
