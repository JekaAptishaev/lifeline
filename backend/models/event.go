package models

import "time"

type Event struct {
    gorm.Model
    Name      string    `json:"name"`
    Date      time.Time `json:"date"`
    Location  string    `json:"location"`
    UserID    uint      `json:"-"`
}
