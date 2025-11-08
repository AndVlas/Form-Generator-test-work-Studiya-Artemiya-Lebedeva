const schema = {
    fields: [
    { type: "text", label: "Имя", model: "name", required: true },
    { type: "email", label: "Email", model: "email", required: true },
    { type: "password", label: "Пароль", model: "password", required: true, minLength: 6 },
    { type: "select", label: "Роль", model: "role", options: ["Админ", "Пользователь"], required: true },
    { type: "checkbox", label: "Согласен с условиями", model: "terms", required: true }
    ]
}

export default schema