# 🔐 ZKWT - Zero-Knowledge Workshop Tool

## 📋 Descripción

**ZKWT** es una herramienta educativa que demuestra los conceptos fundamentales de las **pruebas de conocimiento cero (Zero-Knowledge Proofs)** usando el protocolo **Semaphore**.

Este proyecto permite a los usuarios experimentar con la creación de identidades anónimas, grupos criptográficos y la generación de pruebas ZK de manera interactiva y educativa.

## 🎯 Objetivo Educativo

El objetivo principal es enseñar conceptos de **privacidad y anonimato** en blockchain mediante:

- **Identidades anónimas**: Crear identidades sin revelar información personal
- **Grupos criptográficos**: Formar grupos donde los miembros pueden demostrar pertenencia sin revelar su identidad específica
- **Pruebas Zero-Knowledge**: Generar pruebas matemáticas que demuestran conocimiento sin revelar el conocimiento mismo
- **Aplicaciones prácticas**: Votaciones anónimas, encuestas privadas, verificación de membresía

## 🚀 Características Principales

### ✨ Interfaz Simple (Recomendada)
- **Flujo paso a paso**: Proceso guiado para crear grupos, identidades y pruebas
- **Arquitectura modular**: Componentes separados para cada funcionalidad
- **Comparación de librerías**: Prueba tanto `@semaphore-noir/proof` como `@semaphore-protocol/proof`
- **Debugging avanzado**: Visualización completa de parámetros y errores detallados
- **Interfaz intuitiva**: Diseño limpio y fácil de usar

### 🔧 Funcionalidades Técnicas

1. **Creación de Grupos**
   - Genera grupos criptográficos con árboles de Merkle
   - Configurable depth y gestión de miembros

2. **Gestión de Identidades**
   - Creación de identidades anónimas con commitments únicos
   - Persistencia en localStorage para mantener sesiones

3. **Membresía de Grupos**
   - Agregado seguro de identidades a grupos
   - Verificación de pertenencia sin revelar identidad específica

4. **Generación de Pruebas ZK**
   - Pruebas matemáticas de pertenencia al grupo
   - Soporte para signals (mensajes) y nullifiers (contextos únicos)
   - Comparación entre diferentes implementaciones de librerías

## 🛠️ Tecnologías Utilizadas

- **React 19** + **TypeScript** - Framework y tipado
- **Vite** - Build tool y desarrollo
- **Tailwind CSS** - Estilos y diseño
- **Semaphore Protocol** - Protocolo de Zero-Knowledge
  - `@semaphore-protocol/identity` - Gestión de identidades
  - `@semaphore-protocol/group` - Gestión de grupos
  - `@semaphore-protocol/proof` - Generación de pruebas (versión estable)
  - `@semaphore-noir/proof` - Generación de pruebas (versión experimental)
- **Framer Motion** - Animaciones
- **React Router** - Navegación

## 📦 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd zkwt

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

### Uso de la Aplicación

1. **Acceder a la pestaña "Simple"** - Esta es la versión recomendada
2. **Seguir el flujo paso a paso**:
   - **Paso 1**: Crear un grupo criptográfico
   - **Paso 2**: Crear una identidad anónima
   - **Paso 3**: Agregar la identidad al grupo
   - **Paso 4**: Generar pruebas Zero-Knowledge

3. **Experimentar con diferentes parámetros**:
   - Cambiar signals (mensajes a probar)
   - Modificar nullifiers (contextos únicos)
   - Comparar librerías de pruebas

## 🔍 Casos de Uso Educativos

### 1. **Votación Anónima**
```
Signal: "Voto_Candidato_A"
Nullifier: "eleccion_presidente_2024"
```
Demuestra que puedes votar sin revelar tu identidad específica.

### 2. **Encuesta Privada**
```
Signal: "Satisfaccion_Alta"
Nullifier: "encuesta_empresa_Q1_2024"
```
Participa en encuestas manteniendo privacidad.

### 3. **Verificación de Membresía**
```
Signal: "Acceso_Autorizado"
Nullifier: "sistema_acceso_laboratorio"
```
Demuestra pertenencia a un grupo sin revelar identidad.

## 🐛 Debugging y Troubleshooting

### Problema Conocido: Librería `@semaphore-noir/proof`
- **Error**: `Cannot read properties of undefined (reading 'join')`
- **Solución**: Usar `@semaphore-protocol/proof` (botón verde)
- **Propósito educativo**: Demuestra diferencias entre implementaciones

### Funciones de Debug
- **"Mostrar Parámetros Completos"**: Visualiza todos los parámetros antes de generar pruebas
- **Logs detallados**: Información completa en consola del navegador
- **Gestión de errores**: Mensajes descriptivos con stack traces

## 📚 Conceptos Clave Explicados

### Zero-Knowledge Proofs
Pruebas matemáticas que permiten demostrar conocimiento de un secreto sin revelar el secreto mismo.

### Semaphore Protocol
Protocolo que permite crear pruebas de pertenencia a grupos manteniendo anonimato.

### Commitments
Valores criptográficos que representan una identidad sin revelar información personal.

### Merkle Trees
Estructuras de datos que permiten verificación eficiente de pertenencia a grupos.

### Ejercicios Sugeridos
1. Crear diferentes tipos de grupos y probar membresía
2. Experimentar con diferentes signals y nullifiers
3. Analizar los errores entre diferentes librerías
4. Diseñar casos de uso propios

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado para EKOParty 2025** 🚀
