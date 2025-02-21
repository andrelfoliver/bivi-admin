// clean-index-js.mjs
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho absoluto para a pasta assets dentro de backend/public
const assetsDir = path.join(__dirname, 'backend', 'public', 'assets');

async function cleanIndexFiles() {
    try {
        // Lista os itens da pasta com detalhes (para distinguir arquivos de diretórios)
        const items = await fs.readdir(assetsDir, { withFileTypes: true });

        // Se encontrar algum diretório chamado "assets" dentro de assetsDir, remova-o recursivamente
        for (const item of items) {
            if (item.isDirectory() && item.name === 'assets') {
                const nestedDir = path.join(assetsDir, item.name);
                await fs.rm(nestedDir, { recursive: true, force: true });
                console.log(`Diretório "${item.name}" removido.`);
            }
        }

        // Atualiza a lista de itens após a remoção dos diretórios indesejados
        const files = await fs.readdir(assetsDir);
        // Filtra apenas os arquivos .js que começam com "index-"
        const indexJsFiles = files.filter(file => /^index-.*\.js$/.test(file));

        if (indexJsFiles.length <= 1) {
            console.log("Nenhum arquivo antigo para limpar.");
            return;
        }

        // Obtém as estatísticas de cada arquivo
        const filesWithStats = await Promise.all(
            indexJsFiles.map(async file => {
                const filePath = path.join(assetsDir, file);
                const stats = await fs.stat(filePath);
                return { file, mtime: stats.mtime };
            })
        );

        // Ordena os arquivos do mais recente para o mais antigo
        filesWithStats.sort((a, b) => b.mtime - a.mtime);

        // Mantém apenas o arquivo mais recente e deleta os demais
        const filesToDelete = filesWithStats.slice(1).map(f => f.file);
        for (const file of filesToDelete) {
            const filePath = path.join(assetsDir, file);
            await fs.unlink(filePath);
            console.log(`Arquivo ${file} deletado.`);
        }
    } catch (err) {
        console.error("Erro ao limpar arquivos:", err);
    }
}

cleanIndexFiles();
