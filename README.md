# API Response Comparator

Compara respuestas de dos APIs y muestra las diferencias.

## Requisitos

- Node.js 18+

## Instalación

```bash
npm install
```

## Uso

```bash
npm start
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Cómo funciona

1. Configurar **API 1** (método, URL, body, headers)
2. Configurar **API 2** (misma estructura)
3. Opcional: ignorar campos que cambian siempre (ej. `timestamp, id, date`)
4. Click en **Comparar**
5. Ver el reporte: status HTTP, respuestas lado a lado y diferencias detalladas

Los headers aceptan cualquier clave: `Authorization`, `session_token`, `access_token`, `platform_token`, etc.

## Endpoint directo

```bash
curl -X POST http://localhost:3000/api/compare \
  -H "Content-Type: application/json" \
  -d '{
    "api1": {
      "method": "GET",
      "url": "https://api1.example.com/data",
      "headers": { "Authorization": "Bearer token1" }
    },
    "api2": {
      "method": "GET",
      "url": "https://api2.example.com/data",
      "headers": { "Authorization": "Bearer token2" }
    },
    "options": {
      "ignoreFields": ["timestamp", "id"]
    }
  }'
```
