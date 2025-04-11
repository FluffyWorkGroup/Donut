import { join } from 'path';
import { glob } from 'glob';

async function build() {
    const paths = {
        commands: join(import.meta.dir, 'commands'),
        events: join(import.meta.dir, 'events')
    }

    let finalFiles: string[] = []

    
    console.log('Building commands and events...');
    try {
        for (const path of Object.values(paths)) {
            // Find all TypeScript files in the commands and events directory
            const files = await glob('**/*.ts', { 
                cwd: path,
                absolute: true 
            });
            
            if (files.length === 0) {
                console.log(`No TypeScript files found in ${path}`);
                continue;
            }

            console.log(`Encountered ${files.length} files in ${path.replace(import.meta.dir, '')}`);
            finalFiles.push(...files)
        }

        console.log(`Encountered ${finalFiles.length} files in total`);


        const result = await Bun.build({
            entrypoints: [join(import.meta.dir, 'index.ts'), ...finalFiles],
            outdir: './dist',
            target: 'bun'
        });

        if (result.success) console.log('Build completed successfully');
        
        
    } catch (error) {
        console.error('Build failed:', error);
    }
}

build().catch(console.error); 