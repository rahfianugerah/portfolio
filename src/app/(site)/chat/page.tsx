import BlurFade from "@/components/magicui/blur-fade";
import AssistantChat from "@/app/components/assistant-chat";

export const metadata = {
  title: "AI Assistant",
  description: "Ask Ashley about Rahfi's roles, projects, and certifications.",
};

export default function ChatPage() {
  // The room is the whole route, so the fade has to carry its height too, or the
  // transcript collapses inside a wrapper that has none.
  return (
    <BlurFade delay={0.05} className="h-full">
      <AssistantChat />
    </BlurFade>
  );
}
