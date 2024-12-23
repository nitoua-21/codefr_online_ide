const { spawn } = require('child_process');
const { promises: fs } = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DOCKER_IMAGE = 'codefr:latest';
const TEMP_DIR = path.join(__dirname, '../temp');

// Ensure temp directory exists
fs.mkdir(TEMP_DIR, { recursive: true }).catch(console.error);

/**
 * Execute CodeFr code in a Docker container with resource limits
 * @param {string} code - The CodeFr code to execute
 * @param {string} input - Input for the program
 * @param {Object} options - Execution options
 * @param {number} options.timeLimit - Time limit in milliseconds
 * @param {number} options.memoryLimit - Memory limit in MB
 * @returns {Promise<{output: string, executionTime: number, memoryUsed: number}>}
 */
async function executeCodeFr(code, input = '', options = {}) {
  const {
    timeLimit = 1000,
    memoryLimit = 256
  } = options;

  // Create unique files for this execution
  const executionId = uuidv4();
  const codePath = path.join(TEMP_DIR, `${executionId}.codefr`);
  const inputPath = path.join(TEMP_DIR, `${executionId}.in`);
  const outputPath = path.join(TEMP_DIR, `${executionId}.out`);

  try {
    // Write code and input to files
    await fs.writeFile(codePath, code);
    await fs.writeFile(inputPath, input);

    // Run code in Docker container
    const startTime = Date.now();
    
    const result = await new Promise((resolve, reject) => {
      const docker = spawn('docker', [
        'run',
        '--rm',
        '--network', 'none',
        '--memory', `${memoryLimit}m`,
        '--memory-swap', `${memoryLimit}m`,
        '--cpus', '0.5',
        '-v', `${codePath}:/code.codefr:ro`,
        '-v', `${inputPath}:/input.txt:ro`,
        '-v', `${outputPath}:/output.txt`,
        DOCKER_IMAGE,
        '/usr/local/bin/codefr',
        '/code.codefr',
        '/input.txt',
        '/output.txt'
      ]);

      let stderr = '';
      docker.stderr.on('data', data => {
        stderr += data.toString();
      });

      const timeout = setTimeout(() => {
        docker.kill();
        reject(new Error('Time limit exceeded'));
      }, timeLimit);

      docker.on('close', async (code) => {
        clearTimeout(timeout);
        if (code !== 0) {
          reject(new Error(stderr || 'Runtime error'));
          return;
        }

        try {
          const output = await fs.readFile(outputPath, 'utf8');
          resolve(output);
        } catch (error) {
          reject(error);
        }
      });
    });

    const executionTime = Date.now() - startTime;

    // Get memory usage from Docker stats
    const stats = await new Promise((resolve, reject) => {
      const docker = spawn('docker', ['stats', '--no-stream', '--format', '{{.MemUsage}}']);
      let output = '';
      docker.stdout.on('data', data => {
        output += data.toString();
      });
      docker.on('close', () => {
        const memoryUsed = parseInt(output.split('/')[0]);
        resolve(memoryUsed);
      });
    });

    return {
      output: result,
      executionTime,
      memoryUsed: stats
    };
  } finally {
    // Cleanup temp files
    await Promise.all([
      fs.unlink(codePath).catch(() => {}),
      fs.unlink(inputPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {})
    ]);
  }
}

module.exports = {
  executeCodeFr
};
