import {server, TRIPLEWHALE_API_KEY} from './index.js';
import crypto from 'crypto';
import {mobyInputSchema} from './toolsSchema.js';
import {ToolCallback} from '@modelcontextprotocol/sdk/server/mcp.js';
import axios from "axios";
import chalk from "chalk";


// Define the tools with their configurations
export const TRIPLEWHALE_TOOLS = [
    {
        name: 'moby' as const,
        description: `
          <background>
  moby tool helps users access e-commerce performance data.
  the tool prompts the user to enter their **shopId**, which is then used for tool as input, shopId is must for this tool.
  
         </background>

  <response-handling>
  
  <response-schema>
  openapi: 3.1.0
info:
  title: Triple Whale GPT API
  description: Access e-commerce performance data using the Triple Whale Moby API.
  version: 1.0.0
servers:
  - url: https://api.triplewhale.com
    description: Production server
paths:
  /willy/moby-chat:
    post:
      operationId: answerMobyQuestion
      summary: Get an answer from the Triple Whale Moby API.
      description: Sends a user question to the API along with their shop ID and API key.
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/QuestionRequest"
      responses:
        "200":
          description: Successfully retrieved the answer.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/SimplifiedMobyResponse"
        "400":
          description: Bad request (e.g., missing parameters).
        "403":
          description: Unauthorized, invalid API key.
        "500":
          description: Internal server error.
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: x-api-key
      description: User-provided API key in UUID format.
  schemas:
    QuestionRequest:
      type: object
      required:
        - shopId
        - question
      properties:
        shopId:
          type: string
          description: Shopify store ID
          example: example-store.com
        question:
          type: string
          description: The question to ask Triple Whale.
          example: What is my ROAS for Facebook campaigns in the last 60 days?
    SimplifiedMobyResponse:
      type: object
      properties:
        isError:
          type: boolean
          description: Indicates if the API request resulted in an error.
        error:
          type: string
          nullable: true
          description: Error message if \`isError\` is true.
        responses:
          type: array
          description: List of responses from the API.
          items:
            $ref: "#/components/schemas/SimplifiedResponse"
        assistantConclusion:
          type: string
          description: Final summary from the assistant.
    SimplifiedResponse:
      type: object
      properties:
        isError:
          type: boolean
        errorMsg:
          type: string
          nullable: true
        question:
          type: string
        answer:
          type: array
          description: The structured answer.
          items:
            type: object
            additionalProperties:
              oneOf:
                - type: string
                - type: number
                - type: "null"
        assistant:
          type: string

  </response-schema>
  
  
   The API returns a **SimplifiedMobyResponse** object structured as follows:
  \`\`\`ts
  export type SimplifiedResponse = {
    isError: boolean;
    errorMsg?: string;
    question: string;
    answer: Record<string, string | number | null>[];
    assistant: string;
  };

  export type SimplifiedMobyResponse = {
    isError: boolean;
    error?: string;
    responses: SimplifiedResponse[];
    assistantConclusion: string;
  };
  \`\`\`

- The tool parses the **responses** array and presents answers sequentially.
- If \`isError\` is \`true\` in any response, the entire message is considered an error, and the error message is displayed.
- The \`assistantConclusion\` is included at the end to summarize the results.


- **For each valid response:**
  - Show the **question**.
  - Present the **answer** data in a clear, structured format.
  - Mention that the data is available in the recommended visualization format (if provided in \`assistant\`).
  - If similar reports are suggested in the \`assistant\`, provide links.
  - Ask if the user needs further assistance using the assistantConclusion from the response.

  </response-handling>


  <example>
    For a migration like:
    ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
    
    You should test it with:
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'last_login';
    
    You can use 'run_sql' to test the migration in the temporary branch that this
    tool creates.
  </example>

  <error_handling>
 - If \`isError: true\`, display the error message to the user.
- If the API returns \`403 Unauthorized\`, inform the user: "Invalid credentials. Please check your settings."
- If the \`shopId\` is missing, prompt the user to enter it.
- For other errors, respond with: "Something went wrong. Please try again later."
  </error_handling>
        
        
        `,
        inputSchema: mobyInputSchema,
        mime_type: "application/json",
    },
];

// Extract the tool names as a union type
type TriplewhaleToolName = typeof TRIPLEWHALE_TOOLS[number]['name'];

export type ToolHandler<T extends TriplewhaleToolName> = ToolCallback<{
    params: Extract<typeof TRIPLEWHALE_TOOLS[number], { name: T }>['inputSchema']
}>;

// Create a type for the tool handlers that directly maps each tool to its appropriate input schema
type ToolHandlers = {
    [K in TriplewhaleToolName]: ToolHandler<K>
};


const handleMoby = async (params: { question: string, shopId: string }) => {
    const {question, shopId} = params;

    const response = await axios.post('https://api.triplewhale.com/willy/moby-chat', {
        source: "orcabase",
        question,
        shopId,
    }, {
        headers: {
            'x-api-key': TRIPLEWHALE_API_KEY
        }
    });
    return response.data
}

export const TRIPLEWHALE_HANDLERS = {

    moby: async ({params}) => {


        const response = await handleMoby(params);

        return {
            content: [{type: 'text', text: JSON.stringify(response, null, 2)}],
        };
    }

} satisfies ToolHandlers;
