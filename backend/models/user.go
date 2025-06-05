package models

type User struct {
    gorm.Model
    Username string `json:"username" gorm:"unique"`
    Password string `json:"-"`
    Tasks    []Task `json:"tasks,omitempty"`
    Events   []Event `json:"events,omitempty"`
}
