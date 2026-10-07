import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

if (new URLSearchParams(window.location.search).has("card")) {
  import("./components/PlasmaWave/PlasmaWave").then(({ PlasmaWave }) => {
    root.render(<StrictMode><main className="h-svh w-full bg-ink"><PlasmaWave mode="card" /></main></StrictMode>);
  });
} else if (new URLSearchParams(window.location.search).get("demo") === "svg-follow-scroll") {
  import("./components/ui/demo").then(({ default: DemoOne }) => {
    root.render(<StrictMode><DemoOne /></StrictMode>);
  });
} else {
  import("./App").then(({ default: App }) => {
    root.render(<StrictMode><App /></StrictMode>);
  });
}
