<template>
  <form class="auto-form" @submit.prevent="handleSubmit" novalidate>
    <div v-for="field in schema.fields" :key="field.model" class="form-field">
      
      <!-- Text, Email, Password -->
      <div v-if="['text', 'email', 'password'].includes(field.type)" class="input-group">
        <label :for="field.model">
          {{ field.label }}
          <span v-if="field.required" class="required">*</span>
        </label>
        <input
          :id="field.model"
          :type="field.type"
          :value="formValue[field.model]"
          @input="updateField(field.model, $event.target.value)"
          :class="{ error: fieldErrors[field.model] }"
        />
        <div v-if="fieldErrors[field.model]" class="error-message">
          {{ fieldErrors[field.model] }}
        </div>
      </div>

      <!-- Select -->
      <div v-else-if="field.type === 'select'" class="input-group">
        <label :for="field.model">
          {{ field.label }}
          <span v-if="field.required" class="required">*</span>
        </label>
        <select
          :id="field.model"
          :value="formValue[field.model]"
          @change="updateField(field.model, $event.target.value)"
          :class="{ error: fieldErrors[field.model] }"
        >
          <option value="" disabled>Выберите опцию</option>
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <div v-if="fieldErrors[field.model]" class="error-message">
          {{ fieldErrors[field.model] }}
        </div>
      </div>

      <!-- Checkbox -->
      <div v-else-if="field.type === 'checkbox'" class="input-group checkbox-group">
        <label :for="field.model" class="checkbox-label">
          <input
            :id="field.model"
            type="checkbox"
            :checked="formValue[field.model]"
            @change="updateField(field.model, $event.target.checked)"
            :class="{ error: fieldErrors[field.model] }"
          />
          {{ field.label }}
          <span v-if="field.required" class="required">*</span>
        </label>
        <div v-if="fieldErrors[field.model]" class="error-message">
          {{ fieldErrors[field.model] }}
        </div>
      </div>
    </div>

    <button type="submit" class="submit-btn">Отправить</button>
  </form>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'FormGenerator',
  props: {
    schema: {
      type: Object,
      required: true
    },
    modelValue: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'submit'],
  setup(props, { emit }) {
    const formValue = ref({ ...props.modelValue })
    const fieldErrors = ref({})

    const initializeForm = () => {
      props.schema.fields.forEach(field => {
        if (formValue.value[field.model] === undefined) {
          formValue.value[field.model] = field.type === 'checkbox' ? false : ''
        }
      })
    }
    initializeForm()

    const validateField = (field, value) => {
      if (field.required) {
        if (field.type === 'checkbox') {
          if (!value) return 'Это поле обязательно для заполнения'
        } else if (!value || value.trim() === '') {
          return 'Это поле обязательно для заполнения'
        }
      }

      if (field.minLength && value && value.length < field.minLength) {
        return `Минимальная длина: ${field.minLength} символов`
      }

      if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
        return field.errorMessage || 'Неверный формат'
      }

      if (field.type === 'email' && value && value.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return 'Введите корректный email адрес'
        }
      }

      return null
    }

    const validateForm = () => {
      const errors = {}
      props.schema.fields.forEach(field => {
        const error = validateField(field, formValue.value[field.model])
        if (error) errors[field.model] = error
      })
      fieldErrors.value = errors
      return Object.keys(errors).length === 0
    }

    const updateField = (fieldName, value) => {
      formValue.value[fieldName] = value
      emit('update:modelValue', { ...formValue.value })
      const field = props.schema.fields.find(f => f.model === fieldName)
      if (field) {
        const error = validateField(field, value)
        if (error) {
          fieldErrors.value[fieldName] = error
        } else {
          delete fieldErrors.value[fieldName]
        }
      }
    }

    const handleSubmit = () => {
      if (validateForm()) {
        emit('submit', formValue.value)
      }
    }

    watch(() => props.modelValue, (newValue) => {
      formValue.value = { ...newValue }
      initializeForm()
    }, { deep: true })

    return {
      formValue,
      fieldErrors,
      updateField,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.auto-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-field {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #e74c3c;
}

input, select {
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus, select:focus {
  outline: none;
  border-color: #3498db;
}

input.error, select.error {
  border-color: #e74c3c;
}

.checkbox-group {
  flex-direction: column;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  width: auto;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  min-height: 18px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.submit-btn:active {
  transform: translateY(1px);
  background-color: #226998;
}
</style>