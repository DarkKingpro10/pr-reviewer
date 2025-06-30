# PR-Docs

Un servidor MCP (Model Context Protocol) que permite obtener información detallada de Pull Requests de GitHub para generar documentación automática.

## Características

- 🔍 Obtiene metadatos completos de Pull Requests
- 📁 Lista archivos modificados con estadísticas de cambios
- 🔗 Integración con GitHub API usando Octokit
- 📝 Integración con Notion API (en desarrollo)
- 🛠️ Servidor MCP compatible con herramientas de IA

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd PR-Docs
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
GITHUB_TOKEN=tu_github_token_aqui
NOTION_API_KEY=tu_notion_api_key_aqui
NOTION_PAGE_ID=tu_notion_page_id_aqui
```

## Uso

### Como servidor MCP

Ejecuta el servidor:
```
{
  "mcpServers": {
    "pr-reviewer": {
      "command": "npx",
      "args": ["-y", "tsx","/path/to/main.ts"],
    }
  }
}
```

### Herramientas disponibles

#### `fetch-pr-from-URL`
Obtiene información completa de una Pull Request de GitHub.

**Parámetros:**
- `repoOwner` (string): Propietario del repositorio
- `repoName` (string): Nombre del repositorio  
- `PRNumber` (number): Número de la Pull Request

**Ejemplo de uso:**
```typescript
// Obtener PR #49 del repositorio Book-Master-NET/api-cora-cora
{
  "repoOwner": "Book-Master-NET",
  "repoName": "api-cora-cora", 
  "PRNumber": 49
}
```

**Respuesta:**
- Metadatos completos de la PR (título, descripción, estado, etc.)
- Lista de archivos modificados con estadísticas de cambios
- Información de commits y revisiones

## Configuración de GitHub Token

1. Ve a GitHub Settings > Developer settings > Personal access tokens
2. Genera un nuevo token con permisos de `repo` (para repositorios privados) o `public_repo` (para públicos)
3. Copia el token en tu archivo `.env`

## Estructura del proyecto

```
PR-Docs/
├── main.ts              # Servidor MCP principal
├── githubIntegration.ts # Integración con GitHub API
├── notionIntegration.ts # Integración con Notion API
├── config.ts           # Configuración de variables de entorno
├── types.ts            # Definiciones de tipos TypeScript
└── .env                # Variables de entorno
```

## Tecnologías

- **TypeScript** - Lenguaje principal
- **Model Context Protocol SDK** - Framework para servidores MCP
- **Octokit** - Cliente oficial de GitHub API
- **Zod** - Validación de esquemas
- **dotenv** - Gestión de variables de entorno

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

ISC License