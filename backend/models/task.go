package models

import "time"

type Task struct {
    gorm.Model
    Title     string    `json:"title"`
    DueDate   time.Time `json:"due_date"`
    UserID    uint      `json:"-"`
    Completed bool      `json:"completed"`
}
