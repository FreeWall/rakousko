---
description: Sledování a automatické opravování anotací (Agentation Watch Mode)
---

Pokud uživatel spustí tento workflow příkazem `/watch`, postupuj následovně:

1. Zavolej tool `mcp_agentation_watch_annotations` s parametrem `timeoutSeconds: 300` a `batchWindowSeconds: 1`.
2. Pokud se vrátí anotace:
   - Pro každou anotaci proveď analýzu požadavku (`comment`) a místa v kódu (`elementPath`).
   - Implementuj opravu v příslušném souboru.
   - Po opravě zavolej `mcp_agentation_resolve` s ID anotace a krátkým shrnutím.
   - Vrať se ke kroku 1 (smyčka v rámci aktuálního turnu).
3. Pokud dojde k timeoutu bez anotací, spust workflow znovu.

// turbo 4. Spusť proces sledování hned teď.
