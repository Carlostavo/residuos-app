import "./globals.css";
import Header from "@/components/Header";
import { EditProvider, useEdit } from "@/lib/EditContext";
import EditorPanel from "@/components/EditorPanel";

function LayoutWrapper({ children }) {
  const { isEditing } = useEdit();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 relative">
        {isEditing && <EditorPanel />}
        <main
          className={`flex-1 p-6 transition-all duration-300 ${isEditing ? "ml-64 bg-[url('/grid-pattern.png')]" : ""}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <EditProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </EditProvider>
      </body>
    </html>
  );
}
