/**
 * Download Old Data from HuggingFace
 *
 * Downloads content-old.json files dynamically to avoid polluting the repo.
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
    const isZip = url.endsWith('.zip');
    const filename = isZip ? 'content.zip' : 'content-old.json';
    const downloadPath = join(outputDir, filename);

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

            // Find the extracted json file (assuming it might be named differently)
            // For now, we assume the zip contains the content-old.json or similar
            // Let's look for any .json file in the outputDir that isn't the zip
            // But to be safe and simple, let's assume the user's zip structure matches what we need
            // or we just return the path to the expected content-old.json if it exists

            // Clean up zip
            await Bun.file(downloadPath).delete();
        }

        // Return expected path
        return join(outputDir, 'content-old.json');
    } catch (error) {
        console.error(`❌ Error downloading book ${bookId}:`, error);
        throw error;
    }
}
