<template>
  <div id="app">
    <h1>Генератор форм</h1>
    <div class="container">
      <div class="form-section">
        <h2>Форма</h2>
        <FormGenerator 
          :schema="formSchema" 
          v-model="formData"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import FormGenerator from './components/FormGenerator.vue'
import schema from './assets/schema';

export default {
  name: 'App',
  components: {
    FormGenerator
  },


  setup() {
    const formSchema = ref(schema)

    const formData = ref({})

    const handleSubmit = (data) => {
      alert('Форма успешно отправлена!\n' + JSON.stringify(data, null, 2))
      console.log('Отправленные данные:', data)
    }

    return {
      formSchema,
      formData,
      handleSubmit
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

#app {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.container {
  max-width: 600px;
  margin: auto;
}

.form-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}
</style>
