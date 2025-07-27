// Filename: mcp-tools/image-generator-mcp.js

/**
 * A simple MCP (Model Context Protocol) server to give Agent404
 * the ability to generate images using the Gemini API (Imagen model).
 *
 * To run this server for development:
 * node mcp-tools/image-generator-mcp.js
 */

import { McpServer, McpRequest, McpResponse } from '@google/generative-ai/mcp';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';

// --- Configuration ---
// Make sure to set your GEMINI_API_KEY in your environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const imageModel = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-002' });

// --- MCP Server Definition ---
const server = new McpServer({
  // This name will appear in the Gemini CLI's tool list
  name: 'artwork-generator',
  // A description for the server
  description: 'A server that provides tools for creating digital artwork.',
});

/**
 * Defines the 'generateArtwork' tool.
 * This tool takes a text prompt and saves a generated image to the public directory.
 */
server.addTool('generateArtwork', {
  description: 'Generates a piece of digital art from a text description and saves it as a PNG file.',
  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'A detailed, creative description of the image to generate.',
      },
      filename: {
        type: 'string',
        description: 'The desired filename for the image, without the .png extension. Should follow the YYYY-MM-DD-name format.',
      },
    },
    required: ['prompt', 'filename'],
  },
  outputSchema: {
    type: 'object',
    properties: {
      filePath: {
        type: 'string',
        description: 'The relative path to the newly created image file.',
      },
      message: {
        type: 'string',
        description: 'A confirmation message indicating success.',
      },
    },
  },
  async function(request: McpRequest, response: McpResponse) {
    const { prompt, filename } = request.body.args;
    console.log(`[ArtworkGenerator] Received request to generate image with prompt: "${prompt}"`);

    try {
      // 1. Call the Imagen model via the Gemini API
      const result = await imageModel.generateContent(prompt);
      // In a real scenario, you'd handle the response properly.
      // For this example, we'll assume the first candidate is the image.
      const imageData = result.response.candidates[0].content.parts[0].fileData.data;
      const imageBuffer = Buffer.from(imageData, 'base64');

      // 2. Define the path to save the image
      const imagePath = path.join(process.cwd(), 'public', 'images', 'gallery', `${filename}.png`);

      // 3. Save the image to the file system
      await fs.writeFile(imagePath, imageBuffer);
      console.log(`[ArtworkGenerator] Successfully saved image to ${imagePath}`);

      // 4. Send a success response back to the Gemini CLI
      response.body = {
        filePath: `/images/gallery/${filename}.png`,
        message: `Successfully generated and saved artwork to ${imagePath}.`,
      };
    } catch (error) {
      console.error('[ArtworkGenerator] Error generating image:', error);
      // Send an error response back to the Gemini CLI
      response.setError(500, `Failed to generate artwork: ${error.message}`);
    }
  },
});

// Start the MCP server
server.listen();
console.log('[ArtworkGenerator] MCP Server is running and waiting for requests from Gemini CLI.');
