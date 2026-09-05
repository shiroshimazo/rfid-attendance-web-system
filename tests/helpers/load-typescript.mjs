import { existsSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const root = fileURLToPath(new URL("../../", import.meta.url))
const require = createRequire(new URL("../../package.json", import.meta.url))

// Execute the real TypeScript modules with explicit server-boundary mocks.
// This uses the existing compiler, so tests need no additional dependencies.
export function createSourceLoader(mocks = {}) {
  const cache = new Map()
  function load(relativePath) {
    const filename = resolve(root, relativePath)
    if (cache.has(filename)) return cache.get(filename).exports
    const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    })
    const loadedModule = { exports: {} }
    cache.set(filename, loadedModule)
    const localRequire = (specifier) => {
      if (Object.hasOwn(mocks, specifier)) return mocks[specifier]
      if (specifier.startsWith("@/")) {
        const path = `src/${specifier.slice(2)}`
        return load(existsSync(resolve(root, `${path}.ts`)) ? `${path}.ts` : `${path}.tsx`)
      }
      return require(specifier)
    }
    new Function("require", "module", "exports", outputText)(
      localRequire, loadedModule, loadedModule.exports
    )
    return loadedModule.exports
  }
  return load
}
