const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class CodeExecutionService {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
    this.setupTempDirectory();
  }

  async setupTempDirectory() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  generateTempFileName() {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `code_${timestamp}_${random}.cfr`;
  }

  async executeCode(code, input = '') {
    const fileName = this.generateTempFileName();
    const filePath = path.join(this.tempDir, fileName);
    
    try {
      // Write code to temporary file
      await fs.writeFile(filePath, code);

      // Create input file if provided
      let inputPath;
      if (input) {
        inputPath = path.join(this.tempDir, `input_${fileName}.txt`);
        await fs.writeFile(inputPath, input);
      }

      // Execute code
      const result = await this.runInterpreter(filePath, inputPath);

      // Clean up
      await fs.unlink(filePath);
      if (inputPath) {
        await fs.unlink(inputPath);
      }

      return result;
    } catch (error) {
      // Clean up on error
      try {
        await fs.unlink(filePath);
        if (inputPath) {
          await fs.unlink(inputPath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up temporary files:', cleanupError);
      }
      
      console.error('Error executing code:', error);
      throw error;
    }
  }

  runInterpreter(codePath, inputPath = null) {
    return new Promise((resolve, reject) => {
      const args = [codePath];
      if (inputPath) {
        args.push('-i', inputPath);
      }

      const process = spawn('codefr', args);
      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        resolve({
          success: code === 0,
          output: stdout,
          error: stderr,
          exitCode: code
        });
      });

      process.on('error', (error) => {
        console.error('Error executing code:', error);
        reject(error);
      });

      // Set timeout for execution (e.g., 30 seconds)
      setTimeout(() => {
        process.kill();
        reject(new Error('Délai d\'exécution dépassé'));
      }, 30000);
    });
  }

  async validateCode(code) {
    // Basic validation
    if (!code || typeof code !== 'string') {
      throw new Error('Format de code invalide');
    }

    // Check for minimum required structure
    if (!code.includes('Algorithme') || !code.includes('Debut') || !code.includes('Fin')) {
      throw new Error('Le code doit inclure les mots-clés "Algorithme", "Debut" et "Fin"');
    }

    // Size limit (e.g., 1MB)
    if (code.length > 1024 * 1024) {
      throw new Error('La taille du code dépasse la limite');
    }

    return true;
  }
}

module.exports = new CodeExecutionService();
