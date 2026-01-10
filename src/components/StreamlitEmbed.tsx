import React from "react";

interface StreamlitEmbedProps {
  url?: string;
  height?: number;
}

const StreamlitEmbed: React.FC<StreamlitEmbedProps> = ({ url, height = 900 }) => {
  const targetUrl = url || (import.meta.env.VITE_STREAMLIT_URL as string) || "http://localhost:8501";

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="p-3 bg-muted/40 border-b">
        <p className="text-sm text-muted-foreground">
          Embedded Streamlit app from: <span className="font-mono">{targetUrl}</span>
        </p>
      </div>
      <iframe
        src={targetUrl}
        title="Streamlit Disease Detection"
        width="100%"
        height={height}
        style={{ border: 0, background: "white" }}
        allow="clipboard-read; clipboard-write; fullscreen"
        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      />
    </div>
  );
};

export default StreamlitEmbed;
