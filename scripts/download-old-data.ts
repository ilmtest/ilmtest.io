/**
 * Download Old Data from HuggingFace
 *
 * Downloads hadith data files dynamically to avoid polluting the repo.
 * These files are temporary and will be cleaned up after migration.
 * Uses HF_TOKEN and HF_FILE_TEMPLATE environment variables.
 */

import { join } from 'node:path';

export async function downloadOldData(bookId: number, outputDir: string): Promise<string> {
    const token = process.env.HF_TOKEN;
    const template = process.env.HF_FILE_TEMPLATE;

    if (!token || !template) {
        throw new Error('Missing HF_TOKEN or HF_FILE_TEMPLATE environment variables');
    }

    const url = `https://huggingface.co/datasets/${template.replace('{{bookId}}', bookId.toString())}`;
    console.log('url', url);
    const isZip = url.endsWith('.zip');
    const filename = isZip ? 'content.zip' : 'content-old.json';
    const downloadPath = join(outputDir, filename);
    console.log('downloadPath', downloadPath, 'token', token);

    console.log(`⬇️  Downloading data for book ${bookId}...`);
    // console.log(`   URL: ${url}`); // Don't log full URL if it contains private info, but here it's constructed

    try {
        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

        if (!response.ok) {
            throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        await Bun.write(downloadPath, arrayBuffer);
        console.log(`   ✓ Saved to ${downloadPath}`);

        if (isZip) {
            console.log('   📦 Extracting zip...');
            const proc = Bun.spawn(['unzip', '-o', downloadPath, '-d', outputDir], {
                stderr: 'inherit',
                stdout: 'ignore',
            });

            await proc.exited;

            // Find the extracted JSON file dynamically
            const { readdir } = await import('node:fs/promises');
            const files = await readdir(outputDir);
            const jsonFile = files.find((f) => f.endsWith('.json') && f !== filename);

            if (!jsonFile) {
                throw new Error(`No JSON file found in ${outputDir} after extracting zip`);
            }

            console.log(`   ✓ Found extracted JSON: ${jsonFile}`);

            // Clean up zip
            await Bun.file(downloadPath).delete();

            return join(outputDir, jsonFile);
        }

        // Return expected path for non-zip downloads
        return downloadPath;
    } catch (error) {
        console.error(`❌ Error downloading book ${bookId}:`, error);
        throw error;
    }
}
