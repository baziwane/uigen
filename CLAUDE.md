# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in natural language, and Claude generates JSX code that renders in real-time in a sandboxed preview. Components are stored in a virtual file system (no disk writes).

## Commands

```bash
npm run setup     # Install deps, generate Prisma client, run migrations
npm run dev       # Start dev server with Turbopack (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
npm test          # Run Vitest tests
npm test -- --run # Run tests once without watch mode
npm run db:reset  # Reset database (destructive)
```

## Architecture

### Core Flow

1. User sends chat message → `ChatProvider` (`src/lib/contexts/chat-context.tsx`)
2. Message routed to `/api/chat` → `src/app/api/chat/route.ts`
3. Claude uses tools (`str_replace_editor`, `file_manager`) to create/modify files in `VirtualFileSystem`
4. Tool calls stream back to client, `FileSystemContext` applies changes
5. `PreviewFrame` renders generated JSX via Babel transform in browser

### Key Abstractions

**VirtualFileSystem** (`src/lib/file-system.ts`): In-memory file tree. Provides CRUD operations plus text editor commands (`viewFile`, `replaceInFile`, `insertInFile`). State serialized to/from JSON for persistence.

**AI Provider** (`src/lib/provider.ts`): Returns real Anthropic model if `ANTHROPIC_API_KEY` is set, otherwise returns `MockLanguageModel` that generates static counter/form/card examples.

**Tools** (`src/lib/tools/`):

- `str_replace_editor`: view, create, str_replace, insert commands for file editing
- `file_manager`: rename, delete commands

**Contexts** (`src/lib/contexts/`):

- `FileSystemProvider`: Wraps VirtualFileSystem, handles tool call application, triggers re-renders
- `ChatProvider`: Wraps `@ai-sdk/react` useChat hook, wires tool calls to FileSystemContext

### Data Model

SQLite via Prisma. Schema defined in `prisma/schema.prisma`. Two models:

- `User`: email/password auth
- `Project`: stores serialized messages and file system state as JSON strings

### UI Structure

Main layout in `src/app/main-content.tsx`:

- Left panel: Chat interface
- Right panel: Preview/Code tabs with resizable panels
- Code view: FileTree + Monaco editor

### Path Alias

`@/*` maps to `./src/*`

## Testing

Tests in `__tests__` directories alongside source. Uses Vitest with jsdom for component tests. Run single test file:

```bash
npm test -- src/lib/__tests__/file-system.test.ts
```
