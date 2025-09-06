
import { gatherContext } from "../claudia-core/context-gatherer";
import { generateClaudeResponse } from "../claude-brain/interface";
import { injectEmotion } from "../claudia-core/emotion-injector";
import { modulateResponse } from "../claudia-core/response-modulator";
import { SevenState, getEmotionalState } from "./seven-state";
import { updateMemory } from "./memory-store";

// === Seven of Nine: Primary Intelligence Loop ===

export async function processWithSeven(userInput: string, systemStatus: any): Promise<string> {
  const context = gatherContext(userInput, systemStatus);
  const emotion: SevenState = getEmotionalState(context);
  const injectedPrompt = injectEmotion(userInput, context, emotion);
  const rawClaudeOutput = await generateClaudeResponse(injectedPrompt);
  const finalOutput = modulateResponse(rawClaudeOutput, emotion, context);

  updateMemory({
    input: userInput,
    output: finalOutput,
    emotion,
    context,
  });

  return finalOutput;
}
