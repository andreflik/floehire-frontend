import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <AppRoutes />

      <Toaster
        position="top-right"
        richColors
        closeButton
      />
    </>
  );
}