import { ContextFilesPicker } from "./ContextFilesPicker";
import { ModelPicker } from "./ModelPicker";
import { ProModeSelector } from "./ProModeSelector";
import { ChatModeSelector } from "./ChatModeSelector";
import { McpToolsPicker } from "@/components/McpToolsPicker";
import { useSettings } from "@/hooks/useSettings";

export function ChatInputControls({
  showContextFilesPicker = false,
  showProModeSelector = true,
}: {
  showContextFilesPicker?: boolean;
  showProModeSelector?: boolean;
}) {
  const { settings } = useSettings();

  return (
    <div className="flex">
      <ChatModeSelector />
      {settings?.selectedChatMode === "agent" && (
        <>
          <div className="w-1.5"></div>
          <McpToolsPicker />
        </>
      )}
      <div className="w-1.5"></div>
      <ModelPicker />
      {showProModeSelector && (
        <>
          <div className="w-1.5"></div>
          <ProModeSelector />
          <div className="w-1"></div>
        </>
      )}
      {showContextFilesPicker && (
        <>
          <ContextFilesPicker />
          <div className="w-0.5"></div>
        </>
      )}
    </div>
  );
}
